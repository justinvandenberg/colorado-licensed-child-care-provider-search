import { ScrollView, View } from "react-native";

import ProviderCardList from "@/components/ProviderCardList";
import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.root}>
      <View>
        <ProviderCardList />
      </View>
    </ScrollView>
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
