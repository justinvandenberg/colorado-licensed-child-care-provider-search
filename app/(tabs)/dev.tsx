import { Directory, Paths } from "expo-file-system";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { firebaseDb } from "@/firebaseConfig";

import { CdecProvider, Provider } from "@/types/Provider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import {
  downloadStaticMap,
  fetchCdecProviders,
  fetchDbProvider,
  fetchGeoData,
  fetchPlacesData,
  setDbProvider,
  updateDbProvider,
} from "@/utilities/fetch";

import { useTheme } from "@/providers/ThemeProvider";

import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

// File system
const DIR_NAME = "maps";
const FILE_EXT = ".jpg";

export default function DevScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Get the child care providers from CDEC and attach additional data from Google APIs
  const updateProviders = useCallback(
    // TODO: Probably should delete all the existing db entries is ignoreDb is set
    async (ignoreDb: boolean | undefined = false) => {
      let updatedProviders = 0;
      let newProviders = 0;

      try {
        setLoading(true);
        setError(null);

        if (!firebaseDb) {
          throw new Error("Firestore instance is invalid");
        }

        // TODO: Remove zip from this query, it's just to limit dev results
        const providers = await fetchCdecProviders(
          "SELECT * WHERE zip = '80516'"
        );

        // Loop through the providers and add any additional data
        for (const provider of providers) {
          let dbProvider;

          // Don't bother fetching from the db if we want to refetch everything
          if (!ignoreDb) {
            dbProvider = await fetchDbProvider(provider.provider_id);
          }

          /**
           * If the provider exists in the db
           * and the street address matches the one from the CDEC api
           * return the provider from the db
           */
          if (provider.street_address === dbProvider?.street_address) {
            await updateDbProvider(provider.provider_id, {
              ...providerToCdecProvider(provider),
              updated_at: new Date().toISOString(),
            });
            updatedProviders = updatedProviders + 1;
            continue;
          }

          // Get the geo data based off proximity to the address from the CDEC api
          const fullAddress = `${provider.street_address}, ${provider.city}, ${provider.state} ${provider.zip}`;
          const geoData = await fetchGeoData(fullAddress);
          const location = geoData?.geometry?.location;

          if (!location) {
            console.warn(
              `Geocode attempt failed for: ${provider.provider_id} (${fullAddress})`
            );
            continue;
          }

          /**
           * Get the places data (website, phone number, etc.) from the provider_name
           * Uses the lat and lng to help narrow results
           */
          const placesData = await fetchPlacesData(
            provider.provider_name,
            location
          );

          if (!placesData) {
            console.warn(
              `Places data could not be found for: ${provider.provider_name} (${provider.provider_id})`
            );
            // Places data should NOT prevent saving to Firebase
          }

          /**
           * Download the static map image and save it to the local file system
           * The images are saved in the {Paths.cache}/DIR_NAME
           */
          const staticMap = await downloadStaticMap(
            DIR_NAME,
            `${provider.provider_id}${FILE_EXT}`,
            location
          );

          if (!staticMap) {
            console.warn(
              `A static map could not be found for: ${provider.provider_name} (${provider.provider_id})`
            );
          }

          // Combine the data from the above requests and update the db
          const newProvider: Provider = {
            ...provider,
            state: provider.state || "CO", // Sometimes the state is undefined?
            location,
            formatted_address: placesData?.formattedAddress || "",
            place_id: geoData?.place_id || "",
            website: placesData?.websiteUri || "",
            formatted_phone_number: placesData?.nationalPhoneNumber || "",
            static_map_uri: staticMap.uri || "",
            updated_at: new Date().toISOString(),
          };
          await setDbProvider(provider.provider_id, newProvider);
          newProviders = newProviders + 1;
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
        console.log(`✅ ${updatedProviders} existing providers updated`);
        console.log(`✅ ${newProviders} new providers added`);
      }
    },
    []
  );

  const dir = useMemo(() => new Directory(Paths.cache, DIR_NAME), []);

  // Clear the local image cache
  const clearImageCache = useCallback(() => {
    Image.clearDiskCache();
    console.log("✅ Local cache cleared");
  }, []);

  // Delete image from the local file system
  const deleteLocalImages = useCallback(() => {
    if (dir.exists) {
      dir.delete();
    }
    console.log(`✅ ${dir.name} deleted`);
  }, [dir]);

  return (
    <ScrollView style={styles.root}>
      <View style={styles.buttonsWrapper}>
        <Text color={theme.color.green[400]} fontSize={36} fontWeight="600">
          Dev
        </Text>
        <Button
          onPress={() => updateProviders()}
          title="Fetch providers (CDEC)"
          titleColor={theme.color.green[400]}
          titleWeight="mono"
          style={styles.button}
        />
        <Button
          onPress={() => updateProviders(true)}
          title="Fetch providers (CDEC/Google)"
          titleColor={theme.color.green[400]}
          titleWeight="mono"
          style={styles.button}
        />
        <Button
          onPress={clearImageCache}
          title="Clear image cache"
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
      </View>
    </ScrollView>
  );
}

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[950],
    flex: 1,
    paddingLeft: theme.spacing[4],
    paddingRight: theme.spacing[4],
  },
  buttonsWrapper: {
    gap: theme.spacing[2],
    paddingTop: theme.spacing[20],
  },
  button: {
    backgroundColor: "transparent",
    borderColor: theme.color.green[400],
    borderWidth: 2,
  },
}));

function providerToCdecProvider(provider: Provider): CdecProvider {
  const keysToRemove: (keyof Provider)[] = [
    "location",
    "place_id",
    "formatted_address",
    "website",
    "formatted_phone_number",
    "static_map_uri",
  ];
  return Object.fromEntries(
    Object.entries(provider).filter(
      ([key]) => !keysToRemove.includes(key as keyof CdecProvider)
    )
  ) as CdecProvider;
}
