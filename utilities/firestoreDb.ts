import { File } from "expo-file-system";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { Provider, ProviderFilters } from "@/types/Provider";

import { firebaseDb } from "@/firebaseConfig";

import { fetchCdecProviders, transformProviderToCdecProvider } from "./cdec";
import {
  downloadGoogleStaticMapImage,
  fetchGoogleGeoData,
  fetchGooglePlacesData,
} from "./google";

export const DIR_NAME = "maps";
export const FILE_EXT = ".jpg";

/**
 *
 * @param id
 * @param data
 */
const setFirestoreDbProvider = async (id: string, data: any) => {
  return await setDoc(doc(collection(firebaseDb, "providers"), id), data);
};

/**
 *
 * @param id
 * @param data
 */
const updateFirestoreDbProvider = async (
  id: string,
  data: Partial<Provider>
) => {
  return await updateDoc(doc(collection(firebaseDb, "providers"), id), data);
};

/**
 *
 * @param zip {string} The zip code the search within
 * @returns {Promise<Provider[]>} An array of providers
 */
const fetchFirestoreDbProviders = async (
  zip: string,
  providerFilters: ProviderFilters
): Promise<Provider[]> => {
  if (!zip) {
    return [];
  }

  const baseQuery = `SELECT * WHERE zip = '${zip}'`;
  const capacityQueries: string[] = [];
  const settingQueries: string[] = [];
  const programQueries: string[] = [];

  // Map the boolean providerFilters values to query clauses
  for (const [key, value] of Object.entries(providerFilters)) {
    if (!value) {
      continue;
    }

    if (key.startsWith("licensed_")) {
      capacityQueries.push(`\`${key}\` > 0`);
      continue;
    }

    if (key.startsWith("provider_service_type.")) {
      const [, value] = key.split(".");
      settingQueries.push(`"${value}"`);
      continue;
    }

    if (key.startsWith("cccap_")) {
      programQueries.push(`\`${key}\` == TRUE`);
    }
  }

  const clauses = [
    capacityQueries.length && `(${capacityQueries.join(" OR ")})`,
    settingQueries.length &&
      `caseless_one_of(\`provider_service_type\`, ${settingQueries.join(
        ", "
      )})`,
    programQueries.length && `(${programQueries.join(" OR ")})`,
  ].filter(Boolean);

  const filteredQuery = [baseQuery, ...clauses];

  // Get CDEC providers for the given zip code
  let cdecProviders = await fetchCdecProviders(filteredQuery.join(" AND "));

  if (!cdecProviders) {
    return [];
  }

  // Filter CDEC providers by favorites in the local DB
  // TODO: HERERLEKJRE
  if (providerFilters.only_favorites) {
    // cdecProviders.map();
  }

  const ids: string[] = cdecProviders.map((provider) => provider.provider_id);

  // Using the provider ids get all of the matching entries in the db
  const providers = (
    await Promise.all(
      ids.map(async (provider_id) => {
        try {
          const providerSnap = await getDoc(
            doc(firebaseDb, "providers", provider_id)
          );

          if (!providerSnap.exists()) {
            return;
          }
          const provider = providerSnap.data() as Provider;

          // Check if static map file exists, if not fetch it
          const fileName = `${provider.provider_id}${FILE_EXT}`;
          const file = new File(provider.static_map_uri);

          if (!file.exists) {
            const staticMap = await downloadGoogleStaticMapImage(
              DIR_NAME,
              fileName,
              {
                lat: provider.location.lat,
                lng: provider.location.lng,
              }
            );

            if (!staticMap) {
              console.warn(
                `A static map could not be found for: ${provider.provider_name} (${provider.provider_id})`
              );
            }

            // Just in case, update the static map path in the db
            await updateFirestoreDbProvider(provider.provider_id, {
              static_map_uri: staticMap.uri,
            });
          }

          return provider;
        } catch (error) {
          console.warn(`Failed to fetch provider ${provider_id}:`, error);
          return undefined;
        }
      })
    )
  ).filter((provider): provider is Provider => provider !== undefined);
  return providers;
};

/**
 * Fetches a provider from the firestore db using the id
 * @param id {string} The id of the provider
 * @returns {Provider} A provider
 */
const fetchFirestoreDbProvider = async (id: string) => {
  const providerSnap = await getDoc(doc(firebaseDb, "providers", id));
  return providerSnap.exists() ? (providerSnap.data() as Provider) : null;
};

const refetchFirestoreDbProviders = async (
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
      dbProvider = await fetchFirestoreDbProvider(provider.provider_id);
    }

    /**
     * If the provider exists in the db
     * and the street address matches the one from the CDEC api
     * return the provider from the db
     */
    if (provider.street_address === dbProvider?.street_address) {
      await updateFirestoreDbProvider(provider.provider_id, {
        ...transformProviderToCdecProvider(provider),
        updated_at: new Date().toISOString(),
      });
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
      state: provider.state || "CO", // Sometimes the state is undefined?
      location,
      formatted_address: placesData?.formattedAddress || "",
      place_id: geoData.place_id || "",
      website: placesData?.websiteUri || "",
      formatted_phone_number: placesData?.nationalPhoneNumber || "",
      static_map_uri: staticMap.uri || "",
      updated_at: new Date().toISOString(),
    };
    await setFirestoreDbProvider(provider.provider_id, newProvider);
    newProviders.push(newProvider);
  }

  console.log("✅ Providers refetched from Firestore DB");
  return newProviders;
};

export {
  fetchFirestoreDbProvider,
  fetchFirestoreDbProviders,
  refetchFirestoreDbProviders,
  setFirestoreDbProvider,
  updateFirestoreDbProvider,
};
