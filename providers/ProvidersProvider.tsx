import { useQuery } from "@tanstack/react-query";
import { File } from "expo-file-system";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Keyboard } from "react-native";

import { Filters, Provider } from "@/types/Provider";

import { fetchCdecProviders } from "@/utilities/cdec";

import { firebaseDb } from "@/firebaseDb";

import { downloadGoogleStaticMapImage } from "@/utilities/google";

export const DIR_NAME = "maps";
export const FILE_EXT = ".jpg";

const defaultFilters: Filters = {
  only_favorites: false,
  licensed_infant_capacity: false,
  licensed_toddler_capacity: false,
  licensed_preschool_capacity: false,
  licensed_school_age_capacity: false,
  "provider_service_type.Child Care Center": false,
  "provider_service_type.Preschool Program": false,
  "provider_service_type.School-Age Child Care Center": false,
  "provider_service_type.Large Family Child Care Home": false,
  "provider_service_type.Neighborhood Youth Organization": false,
  cccap_authorization_status: false,
};

type ProvidersContextType = {
  applyFilters: (filters: Filters) => void;
  currentProvider: Provider | null;
  error: Error | null;
  isFetching: boolean;
  isFetched: boolean;
  isLoading: boolean;
  filters: Filters;
  providers: Provider[];
  resetProviders: () => void;
  setCurrentProvider: (provider: Provider | null) => void;
  totalFilters: number;
  totalProviders: number;
  updateZip: (zip: string) => void;
  zip: string;
};

const ProvidersContext = createContext<ProvidersContextType>({
  applyFilters: () => {},
  currentProvider: null,
  error: null,
  isFetched: false,
  isFetching: false,
  isLoading: false,
  filters: defaultFilters,
  providers: [],
  resetProviders: () => {},
  setCurrentProvider: () => {},
  totalFilters: 0,
  totalProviders: 0,
  updateZip: () => {},
  zip: "",
});

const ProvidersProvider = ({ children }: PropsWithChildren) => {
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [zip, setZip] = useState<string>("");

  const isZipValid = useMemo(() => zip.length === 5, [zip]);

  const { data, error, isLoading, isFetching, isFetched } = useQuery({
    queryKey: ["fetchProviders", zip, filters],
    queryFn: () => fetchProviders(zip, filters),
    enabled: () => isZipValid, // Only fire when the zip is valid
  });

  // Get the total number of TRUE filters
  const totalFilters = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );
  // Get the total number of providers
  const totalProviders = useMemo(() => data?.length ?? 0, [data]);

  const updateZip = useCallback((zip: string) => {
    setZip(zip);
  }, []);

  const resetProviders = useCallback(() => {
    setZip("");
  }, []);

  useEffect(() => {
    Keyboard.dismiss();
  }, [isFetched]);

  return (
    <ProvidersContext.Provider
      value={{
        applyFilters: setFilters,
        currentProvider,
        error,
        isLoading,
        isFetching,
        isFetched,
        filters,
        providers: data ?? [],
        resetProviders,
        setCurrentProvider,
        totalFilters,
        totalProviders,
        updateZip,
        zip,
      }}
    >
      {children}
    </ProvidersContext.Provider>
  );
};

const useProviders = () => {
  const context = useContext(ProvidersContext);

  if (!context) {
    throw new Error("useProviders must be used within a ProvidersProvider");
  }

  return context;
};

/**
 * Fetch the providers in two steps:
 * 1. Fetch the providers from the CDEC dataset using the given zip and filters
 * 2. Use CDEC ids to fetch the corresponding entries in the Firstore db
 *  2a. If the provider doesn't have a locally stored static map image, fetch one from Google's API
 * @param zip {string} The zip code the search within
 * @param filters {Filters} Filters used to construct the query clauses
 * @returns {Promise<Provider[]>} An array of providers
 */
const fetchProviders = async (
  zip: string,
  filters: Filters
): Promise<Provider[]> => {
  const baseQuery = `SELECT * WHERE zip = '${zip}'`;
  const capacityQueries: string[] = [];
  const settingQueries: string[] = [];
  const programQueries: string[] = [];

  // Map the boolean filters values to query clauses
  for (const [key, value] of Object.entries(filters)) {
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
            await updateDoc(
              doc(collection(firebaseDb, "providers"), provider.provider_id),
              {
                static_map_uri: staticMap.uri,
              }
            );
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

export { ProvidersProvider, useProviders };
