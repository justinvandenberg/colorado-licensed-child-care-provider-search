import { useMemo } from "react";
import { FlatList, View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import Text from "./ui/Text";

import ProviderCard from "./ProviderCard";
import ProviderFilters from "./ProviderFilters";
import ProviderModal from "./ProviderModal";
import ProviderSearch from "./ProviderSearch";

const ProviderCardList = () => {
  const theme = useTheme();
  const { error, loading, providers, setCurrentProvider, totalProviders } =
    useProviders();

  const ListHeaderComponent = useMemo(() => {
    return (
      <View style={styles.listHeaderComponent}>
        <View style={styles.searchWrapper}>
          <ProviderSearch />
          <ProviderFilters />
        </View>
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
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  listHeaderComponent: {
    gap: theme.spacing[4],
    paddingTop: theme.spacing[1],
  },
  searchWrapper: {
    backgroundColor: theme.color.white,
    borderTopLeftRadius: theme.spacing[12],
    borderTopRightRadius: theme.spacing[12],
    borderBottomLeftRadius: theme.spacing[11],
    borderBottomRightRadius: theme.spacing[11],
  },
}));

export default ProviderCardList;
