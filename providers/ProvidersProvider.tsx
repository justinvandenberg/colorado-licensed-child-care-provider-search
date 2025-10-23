import { firebaseDb } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
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
  error: Error | null;
  loading: boolean;
  onPaginatePrev: () => void;
  onPaginateNext: () => void;
  providers: Provider[];
  resetProviders: () => void;
  totalPages: number;
  totalProviders: number;
  updateZip: (zip: string) => void;
  zip: string;
};

const ProvidersContext = createContext<ProviderContextType>({
  error: null,
  loading: false,
  onPaginatePrev: () => {},
  onPaginateNext: () => {},
  providers: [],
  resetProviders: () => {},
  totalPages: 0,
  totalProviders: 0,
  updateZip: () => {},
  zip: "",
});

const ProvidersProvider = ({ children }: PropsWithChildren) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  // const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalProviders, setTotalProviders] = useState<number>(0);
  const [zip, setZip] = useState<string>("");

  const onPaginateNext = useCallback(() => {
    if (pageNumber === totalPages) {
      return;
    }
    setPageNumber((pageNumber) => pageNumber + 1);
  }, [pageNumber, totalPages]);

  const onPaginatePrev = useCallback(() => {
    if (pageNumber === 1) {
      return;
    }
    setPageNumber((pageNumber) => pageNumber - 1);
  }, [pageNumber]);

  const updateZip = useCallback((zip: string) => {
    setZip(zip);
    setPageNumber(1); // Start over
  }, []);

  // Update the total pages every time we fetch new providers
  useEffect(() => {
    /**
     * Can't calculate without a zip code and
     * don't need to recalculate past the first page
     */
    if (!zip || pageNumber > 1) {
      return;
    }

    const fetchAllProviders = async () => {
      const totalProviders = await fetchProviders(zip, 1, 50); // TODO: Make the cap much higher (10000?)
      setTotalProviders(totalProviders.length);
      setTotalPages(Math.ceil(totalProviders.length / PAGE_SIZE));
    };
    fetchAllProviders();
  }, [providers, pageNumber, zip]);

  // Fetch the providers with matching provider_ids from the DB
  useEffect(() => {
    if (!zip) {
      return;
    }

    const fetchMatchingProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        const cdecProviders: CdecProvider[] = await fetchProviders(
          zip,
          pageNumber,
          PAGE_SIZE
        );

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
  }, [pageNumber, zip]);

  const resetProviders = useCallback(() => {
    setProviders([]);
    setZip("");
  }, []);

  return (
    <ProvidersContext.Provider
      value={{
        error,
        loading,
        onPaginateNext,
        onPaginatePrev,
        providers,
        resetProviders,
        totalPages,
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

const fetchProviders = async (
  zip: string = "80516",
  pageNumber: number = 1,
  pageSize: number = PAGE_SIZE
) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Token": `${APP_TOKEN}`,
    },
    body: JSON.stringify({
      query: `SELECT * WHERE zip = '${zip}'`,
      page: { pageNumber, pageSize },
      includeSynthetic: false,
    }),
  });
  const json = await response.json();

  return json;
};

export { ProvidersProvider, useProviders };
