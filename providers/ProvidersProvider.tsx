import { useQuery } from "@tanstack/react-query";
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

import { Provider, ProviderFilters } from "@/types/Provider";

import { fetchFirestoreDbProviders } from "@/utilities/firestoreDb";

const defaultProviderFilters: ProviderFilters = {
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
  applyProviderFilters: (providerFilters: ProviderFilters) => void;
  currentProvider: Provider | null;
  error: Error | null;
  isFetching: boolean;
  isFetched: boolean;
  isLoading: boolean;
  providerFilters: ProviderFilters;
  providers: Provider[];
  resetProviders: () => void;
  setCurrentProvider: (provider: Provider | null) => void;
  totalProviders: number;
  updateZip: (zip: string) => void;
  zip: string;
};

const ProvidersContext = createContext<ProvidersContextType>({
  applyProviderFilters: () => {},
  currentProvider: null,
  error: null,
  isFetched: false,
  isFetching: false,
  isLoading: false,
  providerFilters: defaultProviderFilters,
  providers: [],
  resetProviders: () => {},
  setCurrentProvider: () => {},
  totalProviders: 0,
  updateZip: () => {},
  zip: "",
});

const ProvidersProvider = ({ children }: PropsWithChildren) => {
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
  const [providerFilters, setProviderFilters] = useState<ProviderFilters>(
    defaultProviderFilters
  );
  const [zip, setZip] = useState<string>("");

  const { data, error, isLoading, isFetching, isFetched } = useQuery({
    queryKey: ["fetchFirestoreDbProviders", zip, providerFilters],
    queryFn: () => fetchFirestoreDbProviders(zip, providerFilters),
    enabled: () => zip.length === 5, // Only fire when the zip is valid
  });

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
        applyProviderFilters: setProviderFilters,
        currentProvider,
        error,
        isLoading,
        isFetching,
        isFetched,
        providerFilters,
        providers: data ?? [],
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
