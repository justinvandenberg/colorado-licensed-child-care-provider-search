import { DimensionValue, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useMemo } from "react";

interface SkeletonProps {
  radii?: number;
  height?: DimensionValue;
  width?: DimensionValue;
  style?: StyleProp<ViewStyle>;
  variant?: "button" | "buttonCompact" | "text";
}

const Skeleton = ({
  radii = 16,
  height = "auto",
  width = "100%",
  style,
  variant,
}: SkeletonProps) => {
  const theme = useTheme();
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const borderRadiusStyle = useMemo(() => {
    switch (variant) {
      case "button":
        return theme.spacing[7];
      case "text":
        return 6;
      default:
        return radii;
    }
  }, [variant, theme.spacing, radii]);

  const heightStyle = useMemo(() => {
    switch (variant) {
      case "button":
        return theme.spacing[18];
      case "buttonCompact":
        return theme.spacing[12];
      case "text":
        return theme.spacing[4];
      default:
        return height;
    }
  }, [variant, theme.spacing, height]);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, {
        duration: 700,
      }),
      -1, // Infinite loop
      true // Reverse
    );
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.root,
        {
          borderRadius: borderRadiusStyle,
          height: heightStyle,
          width,
        },
        animatedStyle,
        style,
      ]}
    ></Animated.View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[200],
  },
}));

export default Skeleton;
