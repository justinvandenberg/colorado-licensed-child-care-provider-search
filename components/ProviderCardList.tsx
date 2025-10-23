import { useMemo } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import Pagination from "./ui/Pagination";
import Text from "./ui/Text";

import ProviderCard from "./ProviderCard";
import ProviderCardSkeleton from "./ProviderCard/ProviderCardSkeleton";

const ProviderCardList = () => {
  const theme = useTheme();
  const {
    error,
    loading,
    onPaginateNext,
    onPaginatePrev,
    providers,
    totalPages,
    totalProviders,
  } = useProviders();

  const ProviderCards = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.skeletonWrapper}>
          <ProviderCardSkeleton />
          <ProviderCardSkeleton />
        </View>
      );
    }
    if (providers.length > 0) {
      return (
        <>
          {providers.map((provider) => {
            return (
              <View key={provider.provider_id}>
                <ProviderCard {...provider} />
              </View>
            );
          })}
        </>
      );
    }
  }, [loading, providers]);

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={[styles.root]}>
      <Text color={theme.color.violet[400]} fontWeight={600} center={true}>
        {totalProviders > 0
          ? `Found ${totalProviders} child care providers`
          : " "}
      </Text>
      {ProviderCards}
      {providers.length > 0 && totalPages > 1 && (
        <Pagination onNext={onPaginateNext} onPrev={onPaginatePrev} />
      )}
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
    paddingTop: 2,
  },
}));

export default ProviderCardList;
