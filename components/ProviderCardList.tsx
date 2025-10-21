import { ActivityIndicator, Text, View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";

import ProviderCard from "./ProviderCard";
import Pagination from "./ui/Pagination";

const ProviderCardList = () => {
  const { providers, loading, error, onNext, onPrev } = useProviders();

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={[styles.root]}>
      <Text>Found {providers?.length ?? 0} child care providers</Text>
      {providers.length > 0 &&
        providers?.map((provider) => {
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
  },
}));

export default ProviderCardList;
