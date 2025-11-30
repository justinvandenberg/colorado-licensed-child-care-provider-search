import {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetModalProps as GorhomBottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { LinearGradient } from "expo-linear-gradient";
import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import BackToTopButton from "./BackToTopButton";

export type BottomSheetModalType = GorhomBottomSheetModal;

export type BottomSheetModalProps = GorhomBottomSheetModalProps &
  PropsWithChildren;

const BottomSheetModal = forwardRef<
  BottomSheetModalType,
  BottomSheetModalProps
>(({ children, snapPoints = ["90%"], ...props }, ref) => {
  const scrollRef = useRef<ScrollView>(null);

  const [scrollY, setScrollY] = useState<number>(0);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.8}
        pressBehavior="close"
        style={styles.backdrop}
      />
    ),
    []
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const yOffset = event.nativeEvent.contentOffset.y;
      setScrollY(yOffset);
    },
    []
  );

  return (
    <GorhomBottomSheetModal
      {...props}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetModalBackground}
      enableDynamicSizing={false}
      handleIndicatorStyle={styles.bottomSheetModalHandleIndicator}
      ref={ref}
      snapPoints={snapPoints}
      style={styles.root}
    >
      <LinearGradient
        colors={["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)"]}
        style={styles.topGradient}
      />
      <BottomSheetScrollView style={styles.scrollWrapper} ref={scrollRef}>
        {children}
        <BackToTopButton scrollRef={scrollRef} />
      </BottomSheetScrollView>
    </GorhomBottomSheetModal>
  );
});

// This is important for devtools
BottomSheetModal.displayName = "BottomSheetModal";

const styles = createThemedStyleSheet((theme) => ({
  root: {
    flex: 1,
    position: "relative",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: theme.spacing[2],
    right: theme.spacing[2],
    height: theme.spacing[4],
    zIndex: 10,
  },
  bottomSheetModalBackground: {
    backgroundColor: theme.color.white,
    borderTopLeftRadius: theme.spacing[11],
    borderTopRightRadius: theme.spacing[11],
    borderColor: theme.color.violet[200],
    borderWidth: 1,
  },
  bottomSheetModalHandleIndicator: {
    backgroundColor: theme.color.violet[100],
  },
  backdrop: {
    backgroundColor: theme.color.violet[950],
  },
  scrollWrapper: {
    flex: 1,
    paddingTop: theme.spacing[2],
  },
}));

export default BottomSheetModal;
