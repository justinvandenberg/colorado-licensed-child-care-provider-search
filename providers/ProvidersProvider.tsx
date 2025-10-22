import { firebaseDb } from "@/firebaseConfig";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
} from "firebase/firestore";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { CdecProvider, Provider } from "@/types/Provider";

// CDEC API
export const API_URL =
  "https://data.colorado.gov/api/v3/views/a9rr-k8mu/query.json";
export const APP_TOKEN =
  process.env.CDEC_APP_TOKEN ?? process.env.EXPO_PUBLIC_CDEC_APP_TOKEN;
export const PAGE_SIZE = 5;
export const MAX_PAGE_NUMBER = 10;

type ProviderContextType = {
  providers: Provider[];
  loading: boolean;
  error: Error | null;
  onPrev: () => void;
  onNext: () => void;
  updateZip: (zip: string) => void;
  resetProviders: () => void;
  zip: string;
};

const ProvidersContext = createContext<ProviderContextType>({
  providers: [],
  loading: false,
  error: null,
  onPrev: () => {},
  onNext: () => {},
  updateZip: () => {},
  resetProviders: () => {},
  zip: "",
});

const ProvidersProvider = ({ children }: PropsWithChildren) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  // const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number | undefined>(5);
  const [zip, setZip] = useState<string>("");

  const onNext = useCallback(() => {
    if (pageNumber === totalPages) {
      return;
    }
    setPageNumber((pageNumber) => pageNumber + 1);
  }, [pageNumber, totalPages]);

  const onPrev = useCallback(() => {
    if (pageNumber === 1) {
      return;
    }
    setPageNumber((pageNumber) => pageNumber - 1);
  }, [pageNumber]);

  const updateZip = useCallback((zip: string) => {
    setZip(zip);
  }, []);

  // Count the total pages on mount
  useEffect(() => {
    if (totalPages) {
      return;
    }

    const countTotalPages = async () => {
      const providersSnap = await getCountFromServer(
        collection(firebaseDb, "providers")
      );
      const totalPages = providersSnap.data().count / PAGE_SIZE;
      setTotalPages(totalPages);
    };
    countTotalPages();
  }, [totalPages]);

  // Fetch the providers with matching provider_ids from the DB
  useEffect(() => {
    const fetchMatchingProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        const cdecProviders: CdecProvider[] = await fetchProviders(
          zip,
          Math.min(pageNumber, MAX_PAGE_NUMBER),
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
        providers,
        loading,
        error,
        onNext,
        onPrev,
        updateZip,
        resetProviders,
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
