import { FC } from "react";
import { View } from "react-native";

import { VisitChecklistItems, VisitChecklistValues } from "@/types/Visit";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import Checkbox from "../ui/Checkbox";
import Text from "../ui/Text";

interface VisitChecklistProps {
  items: VisitChecklistItems;
  onChange: (id: number, value: boolean) => void;
  title: string;
  values?: VisitChecklistValues;
}

const VisitChecklist: FC<VisitChecklistProps> = ({
  items,
  onChange,
  title,
  values = [],
}) => {
  const theme = useTheme();

  return (
    <View>
      <Text color={theme.color.violet[400]} fontSize={20} fontWeight={600}>
        {title}
      </Text>
      <View style={styles.questions}>
        {Object.entries(items).map(([id, label]) => {
          const numericId = Number(id);

          return (
            <Checkbox
              direction="reverse"
              initialIsChecked={values[numericId]}
              key={id}
              label={label}
              onChange={() => onChange?.(numericId, !values[numericId])}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  questions: {
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
}));

export default VisitChecklist;
