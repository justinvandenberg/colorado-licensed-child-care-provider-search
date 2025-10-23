import { ScrollView, View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { ProvidersProvider } from "@/providers/ProvidersProvider";

import ProviderCardList from "@/components/ProviderCardList";
import ProviderSearch from "@/components/ProviderSearch";

function HomeScreen() {
  return (
    <ProvidersProvider>
      <ScrollView style={styles.root}>
        <View style={styles.wrapper}>
          <ProviderSearch />
          <ProviderCardList />
        </View>
      </ScrollView>
    </ProvidersProvider>
  );
}

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[200],
    flex: 1,
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[2],
  },
  wrapper: {
    gap: theme.spacing[2],
    paddingBottom: theme.spacing[2],
  },
}));

export default HomeScreen;
