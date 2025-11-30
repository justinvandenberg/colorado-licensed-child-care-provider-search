import { FC } from "react";
import { View } from "react-native";

import { VisitChecklistItems, VisitChecklistValues } from "@/types/Visit";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import Checkbox from "../ui/Checkbox";
import Text from "../ui/Text";

interface VisitBottomSheetModalChecklistProps {
  checklistItems: VisitChecklistItems;
  checklistValues?: VisitChecklistValues;
  onChecklistItemChange: (id: number, value: boolean) => void;
  title: string;
}

const VisitBottomSheetModalChecklist: FC<
  VisitBottomSheetModalChecklistProps
> = ({
  checklistItems,
  checklistValues = [],
  onChecklistItemChange,
  title,
}) => {
  const theme = useTheme();

  return (
    <View>
      <Text color={theme.color.violet[400]} fontSize={20} fontWeight={600}>
        {title}
      </Text>
      <View style={styles.checklistItems}>
        {Object.entries(checklistItems).map(([id, label]) => {
          // Convert to a number
          const numericId = Number(id);

          return (
            <Checkbox
              direction="reverse"
              initialIsChecked={checklistValues[numericId]}
              key={id}
              label={label}
              onChange={() =>
                onChecklistItemChange(numericId, !checklistValues[numericId])
              }
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  checklistItems: {
    gap: theme.spacing[2],
    marginTop: theme.spacing[1],
  },
}));

export default VisitBottomSheetModalChecklist;
