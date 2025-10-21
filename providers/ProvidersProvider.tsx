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
const APP_TOKEN =
  process.env.CDEC_APP_TOKEN ?? process.env.EXPO_PUBLIC_CDEC_APP_TOKEN;
const PAGE_SIZE = 5;
const MAX_PAGE_NUMBER = 10;

type ProviderContextType = {
  providers: Provider[];
  loading: boolean;
  error: Error | null;
  onPrev: () => void;
  onNext: () => void;
};

const ProvidersContext = createContext<ProviderContextType>({
  providers: [],
  loading: false,
  error: null,
  onPrev: () => {},
  onNext: () => {},
});

const ProvidersProvider = ({ children }: PropsWithChildren) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  // const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number | undefined>(5);

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
          Math.min(pageNumber, MAX_PAGE_NUMBER),
          PAGE_SIZE
        );

        if (!cdecProviders) {
          return; // Abort
        }

        const providerIds: string[] = cdecProviders.map(
          (provider) => provider.provider_id
        );
        const matchingProviders = await Promise.all(
          providerIds.map(async (provider_id) => {
            const providerSnap = await getDoc(
              doc(firebaseDb, "providers", provider_id)
            );
            return providerSnap.data() as Provider;
          })
        );

        setProviders(matchingProviders);
      } catch (error) {
        console.warn("Could not retrieve entries from Firebase");
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchingProviders();
  }, [pageNumber]);

  return (
    <ProvidersContext.Provider
      value={{ providers, loading, error, onNext, onPrev }}
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

export { ProvidersProvider, useProviders };

const API_URL = "https://data.colorado.gov/api/v3/views/a9rr-k8mu/query.json";

export const fetchProviders = async (
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
      query: "SELECT *", // TODO: Add zip query from search
      page: { pageNumber, pageSize },
      includeSynthetic: false,
    }),
  });
  const json = await response.json();

  return json;
};
