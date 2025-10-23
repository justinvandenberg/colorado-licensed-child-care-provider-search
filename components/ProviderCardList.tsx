import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import Text from "./ui/Text";

import ProviderCard from "./ProviderCard";
import ProviderCardSkeleton from "./ProviderCard/ProviderCardSkeleton";
import Pagination from "./ui/Pagination";

const ProviderCardList = () => {
  const theme = useTheme();
  const { providers, loading, error, onNext, onPrev } = useProviders();

  if (loading) {
    return (
      <View style={styles.skeletonWrapper}>
        <ProviderCardSkeleton />
        <ProviderCardSkeleton />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (providers.length === 0) {
    return;
  }

  return (
    <View style={[styles.root]}>
      <Text color={theme.color.violet[400]} fontWeight={600} center={true}>
        Found {providers.length ?? 0} child care providers
      </Text>
      {providers.map((provider) => {
        return (
          <View key={provider.provider_id}>
            <ProviderCard {...provider} />
          </View>
        );
      })}
      <Pagination onNext={onNext} onPrev={onPrev} />
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    gap: theme.spacing[2],
    paddingTop: 2,
  },
  skeletonWrapper: {
    gap: theme.spacing[2],
  },
}));

export default ProviderCardList;
