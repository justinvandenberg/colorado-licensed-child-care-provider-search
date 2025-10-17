import { createStyleSheet } from "@/utilities/createStyleSheet";
import { IconData } from "@lineiconshq/free-icons";
import { Lineicons, LineiconsProps } from "@lineiconshq/react-native-lineicons";
import {
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

import Inline from "./Inline";
import Text from "./Text";

type TextIconProps = {
  direction?: "forwards" | "reverse";
  icon: IconData;
  iconStyle?: LineiconsProps["style"];
  style?: StyleProp<ViewStyle>;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
} & TextProps;

const TextIcon = ({
  direction = "forwards",
  icon,
  iconStyle,
  style,
  title,
  titleStyle,
}: TextIconProps) => {
  const theme = useTheme();
  const flattenedTitleStyle = StyleSheet.flatten(titleStyle);
  const flattenedIconStyle = StyleSheet.flatten(iconStyle);

  return (
    <Inline>
      <View
        style={[
          styles.root,
          {
            flexDirection: direction === "reverse" ? "row-reverse" : "row",
          },
          style,
        ]}
      >
        <Lineicons
          color={
            flattenedIconStyle.color
              ? flattenedIconStyle.color
              : theme.color.violet[400]
          }
          icon={icon}
          size={24}
          strokeWidth={2}
          style={[
            { [direction === "reverse" ? "marginRight" : "marginLeft"]: -2 },
            iconStyle,
          ]}
        />
        <Text
          color={
            flattenedTitleStyle.color
              ? flattenedTitleStyle.color
              : theme.color.violet[950]
          }
          fontWeight={500}
          style={titleStyle}
        >
          {title}
        </Text>
      </View>
    </Inline>
  );
};

const styles = createStyleSheet((theme) => ({
  root: {
    alignItems: "center",
    gap: theme.spacing[1],
  },
}));

export default TextIcon;
