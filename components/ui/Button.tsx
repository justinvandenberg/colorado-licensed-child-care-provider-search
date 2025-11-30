import Feather from "@expo/vector-icons/Feather";
import { ComponentType, useMemo } from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import type { SvgProps } from "react-native-svg";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import Inline from "./Inline";
import Text, { TextProps } from "./Text";
import { IconName } from "./TextIcon";

export type ButtonProps = PressableProps & {
  direction?: "forward" | "reverse";
  iconColor?: string;
  iconName?: IconName;
  iconOnly?: boolean;
  iconSize?: number;
  isDisabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  size?: "compact";
  style?: StyleProp<ViewStyle>;
  SvgIcon?: ComponentType<SvgProps>;
  title: string;
  titleColor?: TextProps["color"];
  titleSize?: TextProps["fontSize"];
  titleWeight?: TextProps["fontWeight"];
  variant?: "inverted";
};

const Button = ({
  direction = "forward",
  iconColor,
  iconName,
  iconOnly = false,
  iconSize = 20,
  isDisabled = false,
  onPress,
  size,
  style,
  SvgIcon,
  title,
  titleColor,
  titleSize = 16,
  titleWeight = 600,
  variant,
}: ButtonProps) => {
  const theme = useTheme();

  const Button = useMemo(() => {
    if (iconName && SvgIcon) {
      throw new Error(
        "Please provide either an iconName or a SvgIcon, not both"
      );
    }

    return (
      <Pressable
        aria-label={iconOnly ? title : undefined}
        disabled={isDisabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.root,
          size === "compact" && styles.sizeCompact,
          variant === "inverted" && styles.variantInverted,
          isDisabled && styles.isDisabled,
          {
            flexDirection: direction === "reverse" ? "row-reverse" : "row",
          },
          style,
        ]}
      >
        {iconName && (
          <Feather
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
        {SvgIcon && <SvgIcon />}
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
    iconColor,
    iconName,
    iconOnly,
    iconSize,
    isDisabled,
    onPress,
    size,
    style,
    SvgIcon,
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
  sizeCompact: {
    backgroundColor: theme.color.violet[100],
    borderRadius: 12,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  variantInverted: {
    backgroundColor: theme.color.transparent,
  },
  isDisabled: {
    opacity: 0.4,
    pointerEvents: "none",
  },
  title: {
    marginTop: 3,
  },
}));

export default Button;
