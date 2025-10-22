import { ActivityIndicator, View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import Pagination from "./ui/Pagination";
import Text from "./ui/Text";

import ProviderCard from "./ProviderCard";

const ProviderCardList = () => {
  const theme = useTheme();
  const { providers, loading, error, onNext, onPrev } = useProviders();

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (providers.length === 0) {
    return;
  }

  return (
    <View style={[styles.root]}>
      <Text fontWeight={600} center={true}>
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
}));

export default ProviderCardList;
