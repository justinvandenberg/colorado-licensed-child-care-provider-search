import { ScrollView, View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { ProvidersProvider } from "@/providers/ProvidersProvider";

import ProviderCardList from "@/components/ProviderCardList";

export default function HomeScreen() {
  return (
    <ProvidersProvider>
      <ScrollView style={styles.root}>
        <View>
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
}));
