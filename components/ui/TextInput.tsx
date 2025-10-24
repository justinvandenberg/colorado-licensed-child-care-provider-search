import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import Octicons from "@expo/vector-icons/Octicons";
import { FC } from "react";
import {
  ColorValue,
  TextInput as RnTextInput,
  TextInputProps as RnTextInputProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

import Text from "./Text";
import { IconName } from "./TextIcon";

type TextInputProps = {
  disabled?: boolean;
  iconColor?: ColorValue;
  iconName?: IconName;
  label: string;
  labelColor?: ColorValue;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  textInputStyle?: RnTextInputProps["style"];
} & RnTextInputProps;

const TextInput: FC<TextInputProps> = ({
  disabled = false,
  iconColor,
  iconName,
  label,
  labelColor,
  onChangeText,
  showLabel = true,
  style,
  textInputStyle,
  value = "",
  ...props
}) => {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      {showLabel && (
        <Text color={labelColor} fontWeight={500}>
          {label}
        </Text>
      )}
      <View style={[styles.textInputWrapper, style]}>
        {iconName && (
          <Octicons
            color={iconColor ? iconColor : theme.color.violet[400]}
            name={iconName}
            size={24}
          />
        )}
        <RnTextInput
          {...props}
          editable={!disabled}
          onChangeText={onChangeText}
          style={[styles.textInput, textInputStyle]}
          value={value}
        />
      </View>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    gap: theme.spacing[1],
  },
  textInputWrapper: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.color.white,
    backgroundColor: theme.color.white,
    borderRadius: theme.spacing[6],
    flexDirection: "row",
    fontSize: 16,
    paddingLeft: theme.spacing[4],
    paddingRight: theme.spacing[4],
  },
  textInput: {
    color: theme.color.violet[950],
    flexGrow: 1,
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[4],
    paddingTop: 22,
    paddingBottom: 22,
    fontSize: 16,
  },
}));

export default TextInput;
