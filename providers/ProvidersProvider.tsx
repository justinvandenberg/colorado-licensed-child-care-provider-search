import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Provider } from "@/types/Provider";
import { fetchDbProviders } from "@/utilities/fetch";
import { Keyboard } from "react-native";

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

  useEffect(() => {
    if (!zip) {
      return;
    }

    // Fetch the providers with matching provider_ids from the db
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const dbProviders = await fetchDbProviders(zip);
        setProviders(dbProviders || []);
      } catch (error) {
        console.warn("Could not retrieve entries from Firebase:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
        Keyboard.dismiss();
      }
    };
    fetchProviders();
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
    throw new Error("useProviders must be used within a ProvidersProvider");
  }

  return context;
};

export { ProvidersProvider, useProviders };
