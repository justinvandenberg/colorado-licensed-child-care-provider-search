import { IconData } from "@lineiconshq/free-icons";
import { Lineicons, LineiconsProps } from "@lineiconshq/react-native-lineicons";
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

import { createStyleSheet } from "@/utilities/createStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import Inline from "./Inline";
import Text from "./Text";

type ButtonProps = {
  disabled?: boolean;
  direction?: "forward" | "reverse";
  icon?: IconData;
  iconStyle?: LineiconsProps["style"];
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
  icon,
  iconStyle,
  onPress,
  size,
  style,
  titleStyle,
  title,
  variant,
}: ButtonProps) => {
  const theme = useTheme();
  const flattenedTitleStyle = StyleSheet.flatten(titleStyle);
  const flattenedIconStyle = StyleSheet.flatten(iconStyle);

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
      >
        {icon && (
          <Lineicons
            color={
              size === "compact" || variant === "inverted"
                ? flattenedIconStyle.color
                  ? flattenedIconStyle.color
                  : theme.color.violet[400]
                : undefined
            }
            icon={icon}
            size={24}
            strokeWidth={2}
            style={[
              { [direction === "reverse" ? "marginRight" : "marginLeft"]: -2 },
              iconStyle,
            ]}
          />
        )}
        <Text
          color={
            flattenedTitleStyle.color
              ? flattenedTitleStyle.color
              : size === "compact"
              ? theme.color.violet[950]
              : variant === "inverted"
              ? theme.color.violet[400]
              : theme.color.white
          }
          fontSize={size === "compact" ? 14 : 16}
          fontWeight={size === "compact" ? 500 : 600}
          style={titleStyle}
        >
          {title}
        </Text>
      </Pressable>
    );
  }, [
    direction,
    disabled,
    flattenedIconStyle.color,
    flattenedTitleStyle.color,
    icon,
    iconStyle,
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

const styles = createStyleSheet((theme) => ({
  root: {
    alignItems: "center",
    backgroundColor: theme.color.violet[400],
    borderRadius: theme.spacing[6],
    flexDirection: "row",
    gap: theme.spacing[1],
    justifyContent: "center",
    paddingLeft: theme.spacing[4],
    paddingRight: theme.spacing[4],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[6],
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
}));

export default Button;
