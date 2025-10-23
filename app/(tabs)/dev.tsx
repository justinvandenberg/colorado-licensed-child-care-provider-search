import { Directory, File, Paths } from "expo-file-system";
import { Image } from "expo-image";
import { collection, doc, setDoc } from "firebase/firestore";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { firebaseDb } from "@/firebaseConfig";

import { Provider } from "@/types/Provider";

import { API_URL, APP_TOKEN, PAGE_SIZE } from "@/providers/ProvidersProvider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Button from "@/components/ui/Button";

// Google
const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ??
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

// File system
const DIR_NAME = "maps";
const FILE_EXT = ".jpg";

export default function DevScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Get the child care providers from CDEC and attach additional data from Google APIs
  const refetchProviders = useCallback(async () => {
    let totalProviders = 0;

    try {
      setLoading(true);
      setError(null);

      if (!firebaseDb) {
        throw new Error("Firestore instance is invalid");
      }

      const providers = await fetchProviders(5); // TODO: Change this to a higher value (10000?)
      totalProviders = providers.length;

      // Loop through the providers and add the additional data
      for (const provider of providers) {
        // Step 1: Get the geo data based off proximity to the CDEC address
        const fullAddress = `${provider.street_address}, ${provider.city}, ${provider.state} ${provider.zip}`;
        const geoData = await fetchGeoData(fullAddress);
        const location = geoData?.geometry?.location;

        if (!location) {
          console.warn(
            `Geocode attempt failed for: ${provider.provider_id} (${fullAddress})`
          );
          continue; // Should prevent saving to Firebase
        }

        /**
         * Step 2: Get the places data (website, phone number, etc.) from the provider_na,e
         * Uses the lat and lng to help narrow results
         */
        const placesData = await fetchPlacesDataByTextQuery(
          provider.provider_name,
          location
        );

        if (!placesData) {
          console.warn(
            `Places data could not be found for: ${provider.provider_name} (${provider.provider_id})`
          ); // Should NOT prevent saving to Firebase
        }

        /**
         * Step 3: Download the static map image and save it to the local file system
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
          continue;
        } // Should prevent saving to Firebase

        // Step 4: Combine the data from the previous requests and update Firebase
        const updatedProvider: Provider = {
          ...provider,
          location,
          formatted_address: placesData.formattedAddress,
          place_id: geoData.place_id,
          website: placesData.websiteUri ?? "",
          formatted_phone_number: placesData.nationalPhoneNumber ?? "",
          static_map_uri: staticMap.uri,
          updated_at: new Date().toISOString(),
        };
        updateFirebase(provider.provider_id, updatedProvider);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
      console.log(`⬇️ ${totalProviders} providers fetched successfully`);
    }
  }, []);

  const dir = useMemo(() => new Directory(Paths.cache, DIR_NAME), []);

  // Delete the DIR_NAME directory from the cache and clear the cache
  const clearImageCache = useCallback(() => {
    if (dir.exists) {
      dir.delete();
    }
    Image.clearDiskCache();
  }, [dir]);

  return (
    <ScrollView style={styles.root}>
      <View style={styles.buttonsWrapper}>
        <Button onPress={refetchProviders} title="Refetch providers" />
        <Button onPress={clearImageCache} title="Clear image cache" />
      </View>
    </ScrollView>
  );
}

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[200],
    flex: 1,
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[2],
  },
  buttonsWrapper: {
    gap: theme.spacing[2],
    paddingTop: theme.spacing[20],
  },
}));

const fetchProviders = async (pageSize: number = PAGE_SIZE) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Token": `${APP_TOKEN}`,
    },
    body: JSON.stringify({
      query: "SELECT *",
      page: { pageNumber: 1, pageSize },
      includeSynthetic: false,
    }),
  });
  const json = await response.json();
  return json;
};

// Search by text query + latitude and longitude
const fetchPlacesDataByTextQuery = async (
  name: Provider["provider_name"],
  location: Provider["location"]
) => {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      // @ts-ignore
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask":
          "places.formattedAddress,places.nationalPhoneNumber,places.websiteUri",
      },
      body: JSON.stringify({
        textQuery: name,
        locationBias: {
          circle: {
            center: {
              latitude: location.lat,
              longitude: location.lng,
            },
            radius: 500, // Meters
          },
        },
      }),
    }
  );
  const json = await response.json();
  return json?.places?.[0];
};

// Search by place_id
const fetchPlacesDataByPlaceId = async (placeId: Provider["place_id"]) => {
  const fields = [
    "place_id",
    "opening_hours",
    "website",
    "formatted_phone_number",
  ].join(",");
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`
  );
  const json = await response.json();
  return json.result;
};

const fetchGeoData = async (fullAddress: string) => {
  const encodeFullAddress = encodeURIComponent(fullAddress);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeFullAddress}&key=${GOOGLE_MAPS_API_KEY}`
  );
  const json = await response.json();
  return json.results[0]; // First entry *should* be the most accurate
};

const downloadStaticMap = async (
  dirName: string,
  fileName: string,
  location: {
    lat: string;
    lng: string;
  }
) => {
  const dir = new Directory(Paths.cache, dirName);

  // Create the DB if it doesn't exist
  if (!dir.exists) {
    dir.create();
  }

  const response = await File.downloadFileAsync(
    `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=400x300&maptype=roadmap&markers=color:red%7C${location.lat},${location.lng}&key=${GOOGLE_MAPS_API_KEY}`,
    new File(Paths.cache, dirName, `${fileName}`),
    { idempotent: true } // Overwrite existing files
  );

  return response as File;
};

const updateFirebase = async (docId: string, data: any) => {
  const response = await setDoc(
    doc(collection(firebaseDb, "providers"), docId),
    data
  );

  return response;
};
