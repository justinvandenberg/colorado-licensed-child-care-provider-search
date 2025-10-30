import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Provider, ProviderFilters } from "@/types/Provider";
import { fetchDbProviders } from "@/utilities/fetch";
import { Keyboard } from "react-native";

type ProviderContextType = {
  applyProviderFilters: (providerFilters: ProviderFilters) => void;
  currentProvider: Provider | null;
  error: Error | null;
  loading: boolean;
  providerFilters: ProviderFilters;
  providers: Provider[];
  resetProviders: () => void;
  setCurrentProvider: (provider: Provider | null) => void;
  totalProviders: number;
  updateZip: (zip: string) => void;
  zip: string;
};

const defaultProviderFilters: ProviderFilters = {
  only_favs: false,
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

const ProvidersContext = createContext<ProviderContextType>({
  applyProviderFilters: () => {},
  currentProvider: null,
  error: null,
  loading: false,
  providerFilters: defaultProviderFilters,
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
  const [providerFilters, setProviderFilters] = useState<ProviderFilters>(
    defaultProviderFilters
  );

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
        const dbProviders = await fetchDbProviders(zip, providerFilters);
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
  }, [providerFilters, zip]);

  const resetProviders = useCallback(() => {
    setProviders([]);
    setZip("");
  }, []);

  return (
    <ProvidersContext.Provider
      value={{
        applyProviderFilters: setProviderFilters,
        currentProvider,
        error,
        loading,
        providerFilters,
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
