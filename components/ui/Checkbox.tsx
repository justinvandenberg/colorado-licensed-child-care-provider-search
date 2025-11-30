import Feather from "@expo/vector-icons/Feather";
import { FC, useState } from "react";
import {
  ColorValue,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import Text from "./Text";

type CheckboxProps = {
  direction?: "forward" | "reverse";
  initialIsChecked?: boolean;
  isDisabled?: boolean;
  label: string;
  labelColor?: ColorValue;
  onChange?: (value: boolean) => void;
  showLabel?: boolean;
  size?: "oversized";
  style?: StyleProp<ViewStyle>;
};

const Checkbox: FC<CheckboxProps> = ({
  direction = "forward",
  initialIsChecked = false,
  isDisabled = false,
  label,
  onChange = () => {},
  labelColor,
  showLabel = true,
  size,
}) => {
  const theme = useTheme();

  const [isChecked, setIsChecked] = useState<boolean>(initialIsChecked);

  return (
    <TouchableOpacity
      style={[
        styles.root,
        [
          {
            flexDirection: direction === "reverse" ? "row-reverse" : "row",
            pointerEvents: isDisabled ? "none" : "auto",
          },
        ],
      ]}
      onPress={() => {
        setIsChecked(!isChecked);
        onChange?.(!isChecked);
      }}
      aria-label={!showLabel ? label : undefined}
    >
      <View
        style={[
          styles.checkbox,
          size === "oversized" && styles.sizeOversizedCheckbox,
          isChecked && styles.checkboxChecked,
        ]}
      >
        {isChecked && (
          <Feather
            color={theme.color.white}
            name="check"
            size={size === "oversized" ? 28 : 20}
          />
        )}
      </View>
      {showLabel && (
        <Text fontWeight={500} color={labelColor} style={styles.label}>
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
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.color.violet[400],
    height: theme.spacing[6],
    justifyContent: "center",
    width: theme.spacing[6],
  },
  sizeOversizedCheckbox: {
    borderRadius: 14,
    height: theme.spacing[10],
    width: theme.spacing[10],
  },
  checkboxChecked: {
    backgroundColor: theme.color.violet[700],
    borderColor: theme.color.violet[700],
  },
  label: {
    flexShrink: 1,
    marginTop: 6,
  },
}));

export default Checkbox;
