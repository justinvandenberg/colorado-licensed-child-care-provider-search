import { FC } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import Text from "./ui/Text";

import ProviderFilters from "./ProviderFilters";
import ProviderSearch from "./ProviderSearch";

const ProviderListHeader: FC = () => {
  const theme = useTheme();
  const { totalProviders, isFetched } = useProviders();

  return (
    <View style={styles.root}>
      <View style={styles.wrapper}>
        <ProviderSearch />
        <ProviderFilters />
      </View>
      {isFetched && (
        <Text color={theme.color.violet[400]} fontWeight={600} center={true}>
          Found {totalProviders} child care providers
        </Text>
      )}
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    gap: theme.spacing[4],
    paddingVertical: theme.spacing[1],
  },
  wrapper: {
    backgroundColor: theme.color.white,
    borderTopLeftRadius: theme.spacing[12],
    borderTopRightRadius: theme.spacing[12],
    borderBottomLeftRadius: theme.spacing[11],
    borderBottomRightRadius: theme.spacing[11],
  },
}));

export default ProviderListHeader;
