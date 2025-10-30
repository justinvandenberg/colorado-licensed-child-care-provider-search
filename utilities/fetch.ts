import { Directory, File, Paths } from "expo-file-system";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { CdecProvider, Provider, ProviderFilters } from "@/types/Provider";

import { firebaseDb } from "@/firebaseConfig";

// CDEC API
const CDEC_API_URL =
  "https://data.colorado.gov/api/v3/views/a9rr-k8mu/query.json";
const CDEC_APP_TOKEN =
  process.env.CDEC_APP_TOKEN ?? process.env.EXPO_PUBLIC_CDEC_APP_TOKEN;

// Google APIs
const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ??
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

// Limit max number of providers during dev
const PAGE_SIZE = 20;

/**
 * Fetch the providers from the CDEC API
 * pageSize can be used as a max
 * @param query {string} An SQL query as a string
 * @param pageSize {number} The max number of providers to fetch
 * @returns {CdecProvider} A CdecProvider
 */
const fetchCdecProviders = async (
  query = "SELECT *",
  pageSize: number = PAGE_SIZE
) => {
  const response = await fetch(CDEC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Token": `${CDEC_APP_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      page: { pageNumber: 1, pageSize },
      includeSynthetic: false,
    }),
  });
  const json = await response.json();
  return json;
};

/**
 * Fetch places data from Google's Places API using the TextQuery
 * Latitude and longitude are added to help with accuracy
 * @param name {string} The name of the provider
 * @param location {object} An object containing the latitude and longitude
 * @returns {Provider['location']} An object containing the place data
 */
const fetchPlacesData = async (
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

/**
 * Fetch the geometry data from Google Geocode API
 * @param fullAddress {string} The concatenated address
 * @returns {object} An object containing the geometry data
 */
const fetchGeoData = async (fullAddress: string) => {
  const encodeFullAddress = encodeURIComponent(fullAddress);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeFullAddress}&key=${GOOGLE_MAPS_API_KEY}`
  );
  const json = await response.json();
  return json.results[0]; // First entry *should* be the most accurate
};

/**
 * Fetch the static map image from Google Static Map API and save it to local storage
 * @param dirName {string} The name of the directory for the downloaded images
 * @param fileName {string} The name of the downloaded file
 * @param location {object} An object containing the latitude and longitude
 * @returns {File} The downloaded file
 */
const downloadStaticMap = async (
  dirName: string,
  fileName: string,
  location: {
    lat: string;
    lng: string;
  }
) => {
  const dir = new Directory(Paths.cache, dirName);

  // If the db doesn't exist, create it
  if (!dir.exists) {
    dir.create();
  }

  const response = await File.downloadFileAsync(
    `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=400x300&maptype=roadmap&map_id=b21976870ac0ee2c160fe8a5&markers=color:0x8B8B8B%7C${location.lat},${location.lng}&key=${GOOGLE_MAPS_API_KEY}`,
    new File(Paths.cache, dirName, `${fileName}`),
    { idempotent: true } // Overwrite existing files
  );

  return response as File;
};

const setDbProvider = async (docId: string, data: any) => {
  const response = await setDoc(
    doc(collection(firebaseDb, "providers"), docId),
    data
  );

  return response;
};

const updateDbProvider = async (docId: string, data: Partial<Provider>) => {
  const response = await updateDoc(
    doc(collection(firebaseDb, "providers"), docId),
    data
  );
  return response;
};

/**
 *
 * @param zip {string} The zip code the search within
 * @returns {Provider[]} An array of providers
 */
const fetchDbProviders = async (
  zip: string,
  providerFilters: ProviderFilters
) => {
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
  const cdecProviders: CdecProvider[] = await fetchCdecProviders(
    filteredQuery.join(" AND ")
  );

  if (!cdecProviders) {
    return;
  }

  const providerIds: string[] = cdecProviders.map(
    (provider) => provider.provider_id
  );

  // Using the provider ids get all of the matching entries in the db
  const providers = (
    await Promise.all(
      providerIds.map(async (provider_id) => {
        try {
          const providerSnap = await getDoc(
            doc(firebaseDb, "providers", provider_id)
          );
          return providerSnap.exists()
            ? (providerSnap.data() as Provider)
            : null;
        } catch (error) {
          console.warn(`Failed to fetch provider ${provider_id}:`, error);
          return null;
        }
      })
    )
  ).filter((provider): provider is Provider => provider !== null);

  return providers;
};

/**
 * Fetches a provider from the db using the provider id
 * @param providerId {string} The id of the provider
 * @returns {Provider} A provider
 */
const fetchDbProvider = async (providerId: string) => {
  const providerSnap = await getDoc(doc(firebaseDb, "providers", providerId));
  return providerSnap.exists() ? (providerSnap.data() as Provider) : null;
};

export {
  downloadStaticMap,
  fetchCdecProviders,
  fetchDbProvider,
  fetchDbProviders,
  fetchGeoData,
  fetchPlacesData,
  setDbProvider,
  updateDbProvider,
};
