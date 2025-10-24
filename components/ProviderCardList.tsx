import { useMemo } from "react";
import { FlatList, View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import Text from "./ui/Text";

import ProviderCard from "./ProviderCard";
import ProviderCardSkeleton from "./ProviderCard/ProviderCardSkeleton";
import ProviderModal from "./ProviderModal";
import ProviderSearch from "./ProviderSearch";

const ProviderCardList = () => {
  const theme = useTheme();
  const { error, loading, providers, setCurrentProvider, totalProviders } =
    useProviders();

  const ListHeaderComponent = useMemo(() => {
    return (
      <View style={styles.listHeaderComponent}>
        <ProviderSearch />
        <Text color={theme.color.violet[400]} fontWeight={600} center={true}>
          Found {totalProviders} child care providers
        </Text>
      </View>
    );
  }, [theme.color.violet, totalProviders]);

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View>
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        data={providers}
        renderItem={
          loading
            ? () => <ProviderCardSkeleton />
            : ({ item }) => (
                <ProviderCard
                  {...item}
                  onProviderDetails={() => setCurrentProvider(item)}
                />
              )
        }
        keyExtractor={(item) => item.provider_id}
        contentContainerStyle={{
          gap: theme.spacing[2],
        }}
      />
      <ProviderModal />
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  listHeaderComponent: {
    gap: theme.spacing[2],
    paddingTop: theme.spacing[1],
  },
}));

export default ProviderCardList;
