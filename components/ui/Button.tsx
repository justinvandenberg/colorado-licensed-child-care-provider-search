import Octicons from "@expo/vector-icons/Octicons";
import { useMemo } from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import Inline from "./Inline";
import Text, { TextProps } from "./Text";
import { IconName } from "./TextIcon";

export type ButtonProps = {
  disabled?: boolean;
  direction?: "forward" | "reverse";
  iconColor?: string;
  iconName?: IconName;
  iconOnly?: boolean;
  iconSize?: number;
  onPress: (event: GestureResponderEvent) => void;
  size?: "compact";
  style?: StyleProp<ViewStyle>;
  title: string;
  titleColor?: TextProps["color"];
  titleSize?: TextProps["fontSize"];
  titleWeight?: TextProps["fontWeight"];
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
  title,
  titleColor,
  titleSize = 16,
  titleWeight = 600,
  variant,
}: ButtonProps) => {
  const theme = useTheme();

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
          />
        )}
        {!iconOnly && (
          <Text
            color={
              titleColor
                ? titleColor
                : size === "compact"
                ? theme.color.violet[950]
                : variant === "inverted"
                ? theme.color.violet[400]
                : theme.color.white
            }
            fontSize={titleSize ? titleSize : size === "compact" ? 14 : 16}
            fontWeight={titleWeight ? titleWeight : 600}
            style={styles.title}
          >
            {title}
          </Text>
        )}
      </Pressable>
    );
  }, [
    direction,
    disabled,
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
    titleColor,
    titleSize,
    titleWeight,
    variant,
  ]);

  if (size === "compact") {
    return <Inline>{Button}</Inline>;
  }

  return Button;
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[400],
    borderRadius: theme.spacing[6],
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    padding: theme.spacing[6],
  },
  compact: {
    backgroundColor: theme.color.violet[100],
    borderRadius: 12,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  inverted: {
    backgroundColor: theme.color.transparent,
  },
  title: {
    marginTop: 3,
  },
}));

export default Button;
