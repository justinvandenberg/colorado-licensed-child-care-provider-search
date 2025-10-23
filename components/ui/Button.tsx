import Octicons from "@expo/vector-icons/Octicons";
import { useMemo } from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import Inline from "./Inline";
import Text from "./Text";
import { IconNames } from "./TextIcon";

export type ButtonProps = {
  disabled?: boolean;
  direction?: "forward" | "reverse";
  iconColor?: string;
  iconName?: IconNames;
  iconOnly?: boolean;
  iconSize?: number;
  onPress: (event: GestureResponderEvent) => void;
  size?: "compact";
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  title: string;
  variant?: "inverted";
} & PressableProps;

const Button = ({
  direction = "forward",
  disabled = false,
  iconColor,
  iconName,
  iconOnly = false,
  iconSize = 20,
  onPress,
  size,
  style,
  titleStyle,
  title,
  variant,
}: ButtonProps) => {
  const theme = useTheme();
  const flattenedTitleStyle = StyleSheet.flatten(titleStyle);

  const Button = useMemo(() => {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.root,
          size === "compact" && styles.compact,
          variant === "inverted" && styles.inverted,
          {
            flexDirection: direction === "reverse" ? "row-reverse" : "row",
          },
          style,
        ]}
        disabled={disabled}
        aria-label={iconOnly ? title : undefined}
      >
        {iconName && (
          <Octicons
            color={
              iconColor
                ? iconColor
                : size === "compact"
                ? theme.color.violet[400]
                : variant === "inverted"
                ? theme.color.violet[400]
                : theme.color.white
            }
            name={iconName}
            size={iconSize}
            style={[
              { [direction === "reverse" ? "marginRight" : "marginLeft"]: -2 },
            ]}
          />
        )}
        {!iconOnly && (
          <Text
            color={
              flattenedTitleStyle?.color
                ? flattenedTitleStyle?.color
                : size === "compact"
                ? theme.color.violet[950]
                : variant === "inverted"
                ? theme.color.violet[400]
                : theme.color.white
            }
            fontSize={size === "compact" ? 14 : 16}
            fontWeight={size === "compact" ? 500 : 600}
            style={[styles.title, titleStyle]}
          >
            {title}
          </Text>
        )}
      </Pressable>
    );
  }, [
    direction,
    disabled,
    flattenedTitleStyle?.color,
    iconColor,
    iconName,
    iconOnly,
    iconSize,
    onPress,
    size,
    style,
    theme.color.violet,
    theme.color.white,
    title,
    titleStyle,
    variant,
  ]);

  if (size === "compact") {
    return <Inline>{Button}</Inline>;
  }

  return Button;
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    alignItems: "center",
    backgroundColor: theme.color.violet[400],
    borderRadius: theme.spacing[6],
    flexDirection: "row",
    gap: theme.spacing[1],
    justifyContent: "center",
    padding: theme.spacing[6],
  },
  compact: {
    backgroundColor: theme.color.violet[100],
    borderRadius: theme.spacing[3],
    paddingLeft: theme.spacing[3],
    paddingRight: theme.spacing[3],
    paddingTop: theme.spacing[2],
    paddingBottom: theme.spacing[2],
  },
  inverted: {
    backgroundColor: theme.color.transparent,
  },
  title: {
    marginTop: theme.spacing[1],
  },
}));

export default Button;
