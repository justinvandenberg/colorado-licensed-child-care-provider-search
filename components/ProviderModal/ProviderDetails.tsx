import { FC } from "react";
import { View } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Text from "../ui/Text";
import TextIcon, { IconName } from "../ui/TextIcon";

interface ProviderDetailsProps {
  iconName: IconName;
  listItems: Record<string, string>;
  title: string;
}

const ProviderDetails: FC<ProviderDetailsProps> = ({
  iconName,
  listItems,
  title,
}) => {
  const theme = useTheme();
  return (
    <View style={styles.root}>
      <TextIcon
        iconName={iconName}
        title={title}
        titleColor={theme.color.violet[400]}
        titleSize={18}
        fontWeight={600}
      />
      <View style={styles.list}>
        {Object.entries(listItems).map(([key, value]) => (
          <View key={key} style={styles.listItem}>
            <Text>{key}</Text>
            <Text fontWeight={600}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[2],
  },
  list: {
    gap: theme.spacing[1],
  },
  listItem: {
    flexDirection: "row",
    gap: theme.spacing[1],
  },
}));

export default ProviderDetails;
