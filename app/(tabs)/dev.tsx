import { Directory, Paths } from "expo-file-system";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";

import { Provider } from "@/types/Provider";

import {
  fetchCdecProviders,
  transformProviderToCdecProvider,
} from "@/utilities/cdec";
import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import {
  downloadGoogleStaticMapImage,
  fetchGoogleGeoData,
  fetchGooglePlacesData,
} from "@/utilities/google";

import { DIR_NAME, FILE_EXT } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

import { firebaseDb } from "@/firebaseDb";
import { localDb } from "@/localDb";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DevScreen() {
  const theme = useTheme();
  const dir = useMemo(() => new Directory(Paths.document, DIR_NAME), []);

  // Delete image from the local file system
  const deleteLocalImages = useCallback(() => {
    if (dir.exists) {
      dir.delete();
    }
    console.log(`✅ Directory '${dir.name}' deleted`);
  }, [dir]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.titleWrapper}>
        <Text color={theme.color.green[400]} fontSize={36} fontWeight="600">
          Dev
        </Text>
      </View>
      <ScrollView>
        <View style={styles.buttonsWrapper}>
          <Button
            onPress={() => refetchProviders()}
            title="Fetch providers (CDEC)"
            titleColor={theme.color.green[400]}
            titleWeight="mono"
            style={styles.button}
          />
          <Button
            onPress={() => refetchProviders(true)}
            title="Fetch providers (CDEC/Google)"
            titleColor={theme.color.green[400]}
            titleWeight="mono"
            style={styles.button}
          />
          <Button
            onPress={deleteLocalImages}
            title="Delete local images"
            titleColor={theme.color.green[400]}
            titleWeight="mono"
            style={styles.button}
          />
          <Button
            onPress={() => dropDbTable("users")}
            title="Drop 'users' DB table"
            titleColor={theme.color.green[400]}
            titleWeight="mono"
            style={styles.button}
          />
          <Button
            onPress={() => dropDbTable("visits")}
            title="Drop 'visits' DB table"
            titleColor={theme.color.green[400]}
            titleWeight="mono"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[950],
    gap: theme.spacing[1],
    flex: 1,
    paddingHorizontal: theme.spacing[2],
  },
  titleWrapper: {
    paddingHorizontal: theme.spacing[2],
  },
  buttonsWrapper: {
    gap: theme.spacing[2],
  },
  button: {
    backgroundColor: "transparent",
    borderColor: theme.color.green[400],
    borderWidth: 2,
  },
}));

/**
 * Drop the user table from the local db
 * @returns
 */
const dropDbTable = async (tableName: string) => {
  return await localDb.execAsync(`
    DROP TABLE IF EXISTS ${tableName};
  `);
};

/**
 *
 * @returns
 */
const refetchProviders = async (
  ignoreDb: boolean = false
): Promise<Provider[]> => {
  if (!firebaseDb) {
    throw new Error("Firestore instance is invalid");
  }

  let newProviders = [];
  // TODO: Remove zip from this query, it's just to limit dev results for easier searching
  const cdecProviders = await fetchCdecProviders(
    "SELECT * WHERE zip = '80516'"
  );

  // Loop through the providers and add any additional data
  for (const provider of cdecProviders) {
    let dbProvider;

    // Don't bother fetching from the db if we want to refetch everything
    if (!ignoreDb) {
      const providerSnap = await getDoc(
        doc(firebaseDb, "providers", provider.provider_id)
      );
      dbProvider = providerSnap.exists()
        ? (providerSnap.data() as Provider)
        : null;
    }

    /**
     * If the provider exists in the db
     * and the street address matches the one from the CDEC api
     * return the provider from the db
     */
    if (provider.street_address === dbProvider?.street_address) {
      await updateDoc(
        doc(collection(firebaseDb, "providers"), provider.provider_id),
        {
          ...transformProviderToCdecProvider(provider),
        }
      );
      continue;
    }

    // Get the geo data based off proximity to the address from the CDEC api
    const address = `${provider.street_address}, ${provider.city}, ${provider.state} ${provider.zip}`;
    const geoData = await fetchGoogleGeoData(address);
    const location = geoData?.geometry?.location;

    if (!location) {
      console.warn(
        `❌ Geocode attempt failed for: ${provider.provider_id} (${address})`
      );
      continue;
    }

    /**
     * Get the places data (website, phone number, etc.) from the provider_name
     * Uses the lat and lng to help narrow results
     */
    const placesData = await fetchGooglePlacesData(
      provider.provider_name,
      location
    );

    if (!placesData) {
      console.warn(
        `❌ Places data could not be found for: ${provider.provider_name} (${provider.provider_id})`
      );
      // Places data should NOT prevent saving to firebase
    }

    /**
     * Download the static map image and save it to the local file system
     * The images are saved in the document directory
     */
    const staticMap = await downloadGoogleStaticMapImage(
      DIR_NAME,
      `${provider.provider_id}${FILE_EXT}`,
      location
    );

    if (!staticMap) {
      console.warn(
        `❌ A static map could not be found for: ${provider.provider_name} (${provider.provider_id})`
      );
    }

    // Combine the data from the above requests and update the db
    const newProvider: Provider = {
      ...provider,
      created_at: new Date().toISOString(),
      state: provider.state || "CO", // Sometimes the state is undefined?
      location,
      formatted_address: placesData?.formattedAddress || "",
      place_id: geoData.place_id || "",
      website: placesData?.websiteUri || "",
      formatted_phone_number: placesData?.nationalPhoneNumber || "",
      static_map_uri: staticMap.uri || "",
    };
    await setDoc(
      doc(collection(firebaseDb, "providers"), provider.provider_id),
      newProvider
    );
    newProviders.push(newProvider);
  }

  console.log("✅ Providers refetched");
  return newProviders;
};
