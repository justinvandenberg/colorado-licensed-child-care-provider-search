import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import Octicons from "@expo/vector-icons/Octicons";
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

export type IconNames = keyof typeof Octicons.glyphMap;

type TextIconProps = {
  direction?: "forwards" | "reverse";
  iconColor?: string;
  iconName: IconNames;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
} & TextProps;

const TextIcon = ({
  direction = "forwards",
  iconColor,
  iconName,
  iconSize = 20,
  style,
  title,
  titleStyle,
}: TextIconProps) => {
  const theme = useTheme();
  const flattenedTitleStyle = StyleSheet.flatten(titleStyle);

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
        <Octicons
          color={iconColor ? iconColor : theme.color.violet[400]}
          name={iconName}
          size={iconSize}
          style={[
            { [direction === "reverse" ? "marginRight" : "marginLeft"]: -2 },
          ]}
        />
        <Text
          color={
            flattenedTitleStyle?.color
              ? flattenedTitleStyle?.color
              : theme.color.violet[950]
          }
          fontWeight={500}
          style={[styles.title, titleStyle]}
        >
          {title}
        </Text>
      </View>
    </Inline>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    alignItems: "center",
    gap: theme.spacing[1],
  },
  title: {
    marginTop: theme.spacing[1],
  },
}));

export default TextIcon;
