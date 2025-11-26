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
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Text from "./Text";

const SLIDER_THUMB_SIZE = 40;
const SLIDER_WIDTH = 320;
const SMILEY_SIZE = 40;
const TOTAL_STEPS = 8;
const MAX_VALUE = SLIDER_WIDTH - SLIDER_THUMB_SIZE;
const STEP_WIDTH = MAX_VALUE / TOTAL_STEPS;

type SmileySliderProps = {
  label: string;
  labelColor?: ColorValue;
  onPanEnd?: (value: number) => void;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  initialValue?: number;
};

const SmileySlider: FC<SmileySliderProps> = ({
  label,
  labelColor,
  onPanEnd = () => {},
  showLabel = true,
  style,
  initialValue = 4,
}) => {
  const offset = useSharedValue(Math.floor(initialValue * STEP_WIDTH));
  const currentStep = useSharedValue(Math.floor(initialValue));
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

  // Worklet-safe snap function
  const snapToClosestStep = (value: number) => {
    "worklet";
    const index = Math.round(value / STEP_WIDTH);
    return index * STEP_WIDTH;
  };

  // Handle pan gesture
  const handlePan = Gesture.Pan()
    .onChange((event) => {
      "worklet";
      const nextValue = offset.value + event.changeX;

      // Clamp to 0 – MAX_VALUE
      if (nextValue < 0) {
        offset.value = 0;
      } else if (nextValue > MAX_VALUE) {
        offset.value = MAX_VALUE;
      } else {
        offset.value = nextValue;
      }
    })
    .onEnd(() => {
      "worklet";
      // Snap to closest step
      const snapped = snapToClosestStep(offset.value);
      offset.value = withSpring(snapped);

      // Find the index of the current step
      const stepSize = MAX_VALUE / TOTAL_STEPS;
      currentStep.value = Math.round(snapped / stepSize);

      runOnJS(onPanEnd)(currentStep.value);
    });

  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const smileyStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -currentStep.value * SMILEY_SIZE }],
    };
  });

  return (
    <View style={style}>
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
          <GestureDetector gesture={handlePan}>
            <Animated.View style={[styles.sliderHandle, sliderStyle]} />
          </GestureDetector>
          <View style={styles.sliderTrack} />
        </View>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
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
