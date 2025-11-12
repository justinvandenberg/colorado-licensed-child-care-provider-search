import { FC } from "react";
import { ActivityIndicator, FlatList } from "react-native";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import ProviderCard from "./ProviderCard";
import ProviderListHeader from "./ProviderListHeader";
import ProviderModal from "./ProviderModal";

const ProviderCardList: FC = () => {
  const theme = useTheme();
  const { isFetching, providers, setCurrentProvider, currentProvider } =
    useProviders();

  return (
    <>
      <FlatList
        contentContainerStyle={{
          gap: theme.spacing[2],
          paddingBottom: 104,
        }}
        data={providers}
        keyExtractor={(item) => item.provider_id}
        ListHeaderComponent={ProviderListHeader}
        ListEmptyComponent={() => {
          return (
            isFetching && (
              <ActivityIndicator size="large" color={theme.color.violet[400]} />
            )
          );
        }}
        renderItem={({ item }) => (
          <ProviderCard {...item} onClick={() => setCurrentProvider(item)} />
        )}
      />
      {currentProvider && (
        <ProviderModal
          onClose={() => setCurrentProvider(null)}
          provider={currentProvider}
          visible={!!currentProvider}
        />
      )}
    </>
  );
};

export default ProviderCardList;
