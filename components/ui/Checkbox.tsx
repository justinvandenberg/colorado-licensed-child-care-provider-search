import { useTheme } from "@/providers/ThemeProvider";
import Octicons from "@expo/vector-icons/Octicons";
import { FC } from "react";
import {
  ColorValue,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Text from "./Text";

type CheckboxProps = {
  disabled?: boolean;
  direction?: "forward" | "reverse";
  label: string;
  labelColor?: ColorValue;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  onChange?: (value: boolean) => void;
  startChecked?: boolean;
  isChecked?: boolean;
};

const Checkbox: FC<CheckboxProps> = ({
  disabled = false,
  direction = "forward",
  label,
  onChange = () => {},
  labelColor,
  showLabel = true,
  startChecked = false,
  isChecked = false,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.root,
        [{ flexDirection: direction === "reverse" ? "row-reverse" : "row" }],
      ]}
      onPress={() => onChange?.(!isChecked)}
      aria-label={!showLabel ? label : undefined}
    >
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && (
          <Octicons color={theme.color.white} name="check" size={20} />
        )}
      </View>
      {label && (
        <Text fontWeight={500} style={styles.label}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    gap: theme.spacing[2],
    justifyContent: "space-between",
  },
  checkbox: {
    width: theme.spacing[6],
    height: theme.spacing[6],
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.color.violet[400],
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "blue",
    borderColor: "blue",
  },
  label: {
    flexShrink: 1,
    marginTop: 6,
  },
}));

export default Checkbox;
