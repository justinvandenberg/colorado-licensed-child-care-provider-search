import { FC } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import Text from "../ui/Text";

interface ProviderBottomSheetModalDetailsProps {
  listItems: Record<string, string>;
  title: string;
}

const ProviderBottomSheetModalDetails: FC<
  ProviderBottomSheetModalDetailsProps
> = ({ listItems, title }) => {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <Text color={theme.color.violet[400]} fontSize={20} fontWeight={600}>
        {title}
      </Text>
      <View style={styles.list}>
        {Object.entries(listItems).map(([key, value]) => (
          <View key={key} style={styles.listItem}>
            <Text>{key}</Text>
            <Text fontWeight={600} style={styles.listItemValue}>
              {value === "undefined" ? "NA" : value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    paddingHorizontal: theme.spacing[2],
  },
  list: {
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
  listItem: {
    flexDirection: "row",
    gap: theme.spacing[1],
  },
  listItemValue: {
    flexShrink: 1,
  },
}));

export default ProviderBottomSheetModalDetails;
