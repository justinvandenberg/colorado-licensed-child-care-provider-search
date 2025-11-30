import { FC, RefObject, useCallback } from "react";
import { FlatList, GestureResponderEvent, ScrollView } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

import Button, { ButtonProps } from "./Button";

type BackToTopButtonProps = Omit<ButtonProps, "onPress" | "title"> & {
  buttonStyle?: ButtonProps["style"];
  onPress?: ButtonProps["onPress"];
  scrollRef: RefObject<ScrollView | FlatList | null>;
  title?: string;
};

const BackToTopButton: FC<BackToTopButtonProps> = ({
  buttonStyle,
  onPress,
  scrollRef,
  style,
  title = "Back to top",
  ...props
}) => {
  const handleBackToTop = useCallback(
    (event: GestureResponderEvent) => {
      if (!scrollRef.current) {
        return;
      }
      if ("scrollTo" in scrollRef.current) {
        // ScrollView
        scrollRef.current.scrollTo({
          y: 0,
          animated: true,
        });
      } else {
        // FlatList
        scrollRef.current.scrollToOffset({
          offset: 0,
          animated: true,
        });
      }
      onPress?.(event);
    },
    [onPress, scrollRef]
  );

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={style}>
      <Button
        {...props}
        direction="reverse"
        iconName="arrow-up"
        onPress={handleBackToTop}
        style={buttonStyle}
        title={title}
        variant="inverted"
      />
    </Animated.View>
  );
};

export default BackToTopButton;
