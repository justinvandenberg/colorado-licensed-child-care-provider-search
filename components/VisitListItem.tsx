import { FC } from "react";
import { Pressable, View } from "react-native";

import { Visit } from "@/types/Visit";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import { formatRelativeDate } from "@/utilities/date";

import { useTheme } from "@/providers/ThemeProvider";

import Checkbox from "./ui/Checkbox";
import Text from "./ui/Text";

type VisitListItemProps = {
  initialCheckboxIsChecked?: boolean;
  onCheckboxChange: (isChecked: boolean) => void;
  onPress: () => void;
  visit: Visit;
};

const VisitListItem: FC<VisitListItemProps> = ({
  initialCheckboxIsChecked = false,
  onCheckboxChange,
  onPress,
  visit,
}) => {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.root}>
      <View style={styles.score}>
        <Text fontSize={32} fontWeight={600} color={theme.color.yellow[700]}>
          {visit.score || "—"}
        </Text>
      </View>
      <View style={styles.titleWrapper}>
        <Text
          ellipsizeMode="tail"
          fontSize={18}
          fontWeight={600}
          numberOfLines={1}
        >
          {visit.title}
        </Text>
        <Text>Edited {formatRelativeDate(visit.updated_at || new Date())}</Text>
      </View>
      <View style={styles.checkboxWrapper}>
        <Checkbox
          initialIsChecked={initialCheckboxIsChecked}
          label={`Select ${visit.title}`}
          onChange={onCheckboxChange}
          showLabel={false}
          size="oversized"
        />
      </View>
    </Pressable>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.white,
    borderRadius: theme.spacing[8],
    flexDirection: "row",
    gap: theme.spacing[2],
    padding: theme.spacing[2],
  },
  score: {
    alignItems: "center",
    aspectRatio: "1 / 1",
    backgroundColor: theme.color.yellow[100],
    // borderWidth: 2,
    // borderColor: theme.color.yellow[400],
    borderRadius: 24,
    justifyContent: "center",
    paddingTop: theme.spacing[1],
    width: "25%",
  },
  titleWrapper: {
    flexGrow: 1,
    flexShrink: 1,
    paddingVertical: theme.spacing[2],
  },
  checkboxWrapper: {
    paddingRight: theme.spacing[2],
    paddingVertical: 6,
  },
}));

export default VisitListItem;
