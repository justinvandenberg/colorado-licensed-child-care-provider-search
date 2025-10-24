import { firebaseDb } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CdecProvider, Provider } from "@/types/Provider";
import { Keyboard } from "react-native";

// CDEC API
export const API_URL =
  "https://data.colorado.gov/api/v3/views/a9rr-k8mu/query.json";
export const APP_TOKEN =
  process.env.CDEC_APP_TOKEN ?? process.env.EXPO_PUBLIC_CDEC_APP_TOKEN;
export const PAGE_SIZE = 5;

type ProviderContextType = {
  currentProvider: Provider | null;
  error: Error | null;
  loading: boolean;
  providers: Provider[];
  resetProviders: () => void;
  setCurrentProvider: (provider: Provider | null) => void;
  totalProviders: number;
  updateZip: (zip: string) => void;
  zip: string;
};

const ProvidersContext = createContext<ProviderContextType>({
  currentProvider: null,
  error: null,
  loading: false,
  providers: [],
  resetProviders: () => {},
  setCurrentProvider: () => {},
  totalProviders: 0,
  updateZip: () => {},
  zip: "",
});

const ProvidersProvider = ({ children }: PropsWithChildren) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [zip, setZip] = useState<string>("");
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);

  const totalProviders = useMemo(() => {
    return providers.length;
  }, [providers]);

  const updateZip = useCallback((zip: string) => {
    setZip(zip);
  }, []);

  // Fetch the providers with matching provider_ids from the DB
  useEffect(() => {
    if (!zip) {
      return;
    }

    const fetchMatchingProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        const cdecProviders: CdecProvider[] = await fetchProviders(zip);

        if (!cdecProviders) {
          return;
        }

        const providerIds: string[] = cdecProviders.map(
          (provider) => provider.provider_id
        );

        const matchingProviders = (
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
        setProviders(matchingProviders);
        Keyboard.dismiss();
      } catch (error) {
        console.warn("Could not retrieve entries from Firebase:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchingProviders();
  }, [zip]);

  const resetProviders = useCallback(() => {
    setProviders([]);
    setZip("");
  }, []);

  return (
    <ProvidersContext.Provider
      value={{
        currentProvider,
        error,
        loading,
        providers,
        resetProviders,
        setCurrentProvider,
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
    throw new Error("useTheme must be used within a ProvidersProvider");
  }

  return context;
};

const fetchProviders = async (zip: string) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Token": `${APP_TOKEN}`,
    },
    body: JSON.stringify({
      query: `SELECT * WHERE zip = '${zip}'`,
      page: { pageNumber: 1, pageSize: 50 }, // TODO: Make the cap much higher (5000?)
      includeSynthetic: false,
    }),
  });
  const json = await response.json();
  return json;
};

export { ProvidersProvider, useProviders };
