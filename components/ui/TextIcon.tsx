import Feather from "@expo/vector-icons/Feather";
import { ColorValue, StyleProp, View, ViewStyle } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import Inline from "./Inline";
import Text, { TextProps } from "./Text";

export type IconName = keyof typeof Feather.glyphMap;

type TextIconProps = {
  direction?: "forwards" | "reverse";
  iconColor?: ColorValue;
  iconName: IconName;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  title: string;
  titleColor?: TextProps["color"];
  titleSize?: TextProps["fontSize"];
  titleWeight?: TextProps["fontWeight"];
} & TextProps;

const TextIcon = ({
  direction = "forwards",
  iconColor,
  iconName,
  iconSize = 20,
  style,
  title,
  titleColor,
  titleSize = 16,
  titleWeight = 500,
}: TextIconProps) => {
  const theme = useTheme();

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
        <Feather
          color={iconColor ? iconColor : theme.color.violet[400]}
          name={iconName}
          size={iconSize}
        />
        <Text
          color={titleColor ? titleColor : theme.color.violet[950]}
          fontWeight={titleWeight}
          fontSize={titleSize}
          style={[styles.title, { marginTop: iconSize * 0.15 }]}
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
    gap: 6,
    paddingVertical: theme.spacing[2],
  },
  title: {
    marginTop: 3,
  },
}));

export default TextIcon;
