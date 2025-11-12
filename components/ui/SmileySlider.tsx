import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import React, { FC } from "react";
import { ColorValue, StyleProp, View, ViewStyle } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Text from "./Text";

const SLIDER_THUMB_SIZE = 40;
const SLIDER_WIDTH = 320;
const TOTAL_STEPS = 8;
const SMILEY_SIZE = 40;

type SmileySliderProps = {
  label: string;
  labelColor?: ColorValue;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  value?: number;
};

const SmileySlider: FC<SmileySliderProps> = ({
  showLabel = true,
  label,
  labelColor,
  style,
  value,
}) => {
  const MAX_VALUE = SLIDER_WIDTH - SLIDER_THUMB_SIZE;
  const offset = useSharedValue(Math.floor(MAX_VALUE / 2));
  const index = useSharedValue(Math.floor(TOTAL_STEPS / 2));

  const [assets] = useAssets([
    require("../../assets/images/smiley-slider-0.svg"),
    require("../../assets/images/smiley-slider-1.svg"),
    require("../../assets/images/smiley-slider-2.svg"),
    require("../../assets/images/smiley-slider-3.svg"),
    require("../../assets/images/smiley-slider-4.svg"),
    require("../../assets/images/smiley-slider-5.svg"),
    require("../../assets/images/smiley-slider-6.svg"),
    require("../../assets/images/smiley-slider-7.svg"),
    require("../../assets/images/smiley-slider-8.svg"),
  ]);

  const pan = Gesture.Pan()
    .onChange((event) => {
      offset.value =
        Math.abs(offset.value) <= MAX_VALUE
          ? offset.value + event.changeX <= 0
            ? 0
            : offset.value + event.changeX >= MAX_VALUE
            ? MAX_VALUE
            : offset.value + event.changeX
          : offset.value;
    })
    .onEnd(() => {
      // Change the index
      const pos = offset.value / MAX_VALUE;
      index.value = Math.floor(pos * TOTAL_STEPS);

      // Snap the offset to the nearest step
      const snappedOffset = index.value * (MAX_VALUE / TOTAL_STEPS);
      offset.value = withSpring(snappedOffset);
    });

  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const smileyStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -index.value * SMILEY_SIZE }],
    };
  });

  return (
    <View style={[styles.root, style]}>
      {showLabel && (
        <Text color={labelColor} fontWeight={500}>
          {label}
        </Text>
      )}
      <GestureHandlerRootView
        aria-label={!showLabel ? label : undefined}
        style={styles.smileyWrapper}
      >
        <View style={styles.smiley}>
          <Animated.View style={[styles.smileyImages, smileyStyle]}>
            <Image source={assets?.[0]} style={styles.smileyImage} />
            <Image source={assets?.[1]} style={styles.smileyImage} />
            <Image source={assets?.[2]} style={styles.smileyImage} />
            <Image source={assets?.[3]} style={styles.smileyImage} />
            <Image source={assets?.[4]} style={styles.smileyImage} />
            <Image source={assets?.[5]} style={styles.smileyImage} />
            <Image source={assets?.[6]} style={styles.smileyImage} />
            <Image source={assets?.[7]} style={styles.smileyImage} />
            <Image source={assets?.[8]} style={styles.smileyImage} />
          </Animated.View>
        </View>
        <View style={styles.slider}>
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.sliderHandle, sliderStyle]} />
          </GestureDetector>
          <View style={styles.sliderTrack} />
        </View>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {},
  smileyWrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing[3],
  },
  smiley: {
    height: SMILEY_SIZE,
    position: "relative",
    overflow: "hidden",
    width: SMILEY_SIZE,
  },
  smileyImages: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
  },
  smileyImage: {
    height: SMILEY_SIZE,
    width: SMILEY_SIZE,
  },
  slider: {
    height: SLIDER_THUMB_SIZE,
    justifyContent: "center",
    padding: SLIDER_THUMB_SIZE / 2,
    position: "relative",
    width: SLIDER_WIDTH,
  },
  sliderTrack: {
    backgroundColor: theme.color.violet[200],
    borderRadius: 2,
    height: 3,
  },
  sliderHandle: {
    backgroundColor: theme.color.white,
    borderColor: theme.color.violet[400],
    borderRadius: 14,
    borderWidth: 2,
    height: SLIDER_THUMB_SIZE,
    left: 0,
    position: "absolute",
    width: SLIDER_THUMB_SIZE,
    zIndex: 1,
  },
}));

export default SmileySlider;
