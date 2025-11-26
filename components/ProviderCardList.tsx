import { FC } from "react";
import { ActivityIndicator, FlatList } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

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
        contentContainerStyle={styles.contentContainer}
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
        renderItem={({ item }) => <ProviderCard provider={item} />}
      />
      {currentProvider && (
        <ProviderModal provider={currentProvider} visible={!!currentProvider} />
      )}
    </>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  contentContainer: {
    gap: theme.spacing[2],
  },
}));

export default ProviderCardList;
