import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { ProvidersProvider } from "@/providers/ProvidersProvider";

import ProviderCardList from "@/components/ProviderCardList";

function HomeScreen() {
  return (
    <ProvidersProvider>
      <View style={styles.root}>
        <ProviderCardList />
      </View>
    </ProvidersProvider>
  );
}

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[200],
    flex: 1,
    paddingTop: theme.spacing[1],
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[2],
  },
}));

export default HomeScreen;
