import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import Octicons from "@expo/vector-icons/Octicons";
import { ColorValue, StyleProp, View, ViewStyle } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

import Inline from "./Inline";
import Text, { TextProps } from "./Text";

export type IconName = keyof typeof Octicons.glyphMap;

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
        <Octicons
          color={iconColor ? iconColor : theme.color.violet[400]}
          name={iconName}
          size={iconSize}
          style={[
            { [direction === "reverse" ? "marginRight" : "marginLeft"]: -2 },
          ]}
        />
        <Text
          color={titleColor ? titleColor : theme.color.violet[950]}
          fontWeight={titleWeight}
          fontSize={titleSize}
          style={styles.title}
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
    paddingTop: theme.spacing[2],
    paddingBottom: theme.spacing[2],
  },
  title: {
    marginTop: 3,
  },
}));

export default TextIcon;
