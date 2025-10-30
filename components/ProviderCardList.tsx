import { ActivityIndicator, FlatList } from "react-native";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import ProviderCard from "./ProviderCard";
import ProviderListHeader from "./ProviderListHeader";
import ProviderModal from "./ProviderModal";

const ProviderCardList = () => {
  const theme = useTheme();
  const { isFetching, providers, setCurrentProvider } = useProviders();

  return (
    <>
      <FlatList
        data={providers}
        ListHeaderComponent={ProviderListHeader}
        ListEmptyComponent={() => {
          return isFetching ?? <ActivityIndicator />;
        }}
        renderItem={({ item }) => (
          <ProviderCard
            {...item}
            onProviderDetails={() => setCurrentProvider(item)}
          />
        )}
        keyExtractor={(item) => item.provider_id}
        contentContainerStyle={{
          gap: theme.spacing[2],
          paddingBottom: 104,
        }}
      />
      <ProviderModal />
    </>
  );
};

export default ProviderCardList;
