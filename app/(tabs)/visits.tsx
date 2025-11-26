import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/providers/ThemeProvider";
import { VisitsProvider } from "@/providers/VisitsProvider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Text from "@/components/ui/Text";

import VisitList from "@/components/VisitList";

export default function VisitsScreen() {
  const theme = useTheme();

  return (
    <VisitsProvider>
      <SafeAreaView style={styles.root}>
        <Text color={theme.color.violet[400]} fontSize={36} fontWeight="600">
          Visits
        </Text>
        <VisitList />
      </SafeAreaView>
    </VisitsProvider>
  );
}

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[100],
    gap: theme.spacing[1],
    flex: 1,
    paddingHorizontal: theme.spacing[2],
  },
}));
