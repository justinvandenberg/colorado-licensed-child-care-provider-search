import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import { FC } from "react";
import {
  Modal as RnModal,
  ModalProps as RnModalProps,
  ScrollView,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import Button from "./Button";

type ModalProps = {
  onClose?: () => void;
} & RnModalProps;

const Modal: FC<ModalProps> = ({
  children,
  onClose = () => {},
  style,
  visible = false,
  ...props
}) => {
  return (
    <RnModal
      animationType="slide"
      transparent={true}
      visible={visible}
      {...props}
    >
      {visible && (
        <Animated.View
          entering={FadeIn.duration(200).delay(400)}
          style={styles.overlay}
        />
      )}
      <Button
        iconName="x"
        iconOnly={true}
        onPress={onClose}
        size="compact"
        style={styles.button}
        title="Close"
        variant="inverted"
      />
      <ScrollView style={[styles.root, style]}>{children}</ScrollView>
    </RnModal>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.white,
    borderTopLeftRadius: theme.spacing[11],
    borderTopRightRadius: theme.spacing[11],
    borderColor: theme.color.violet[200],
    borderWidth: 1,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 80,
    zIndex: 0,
    // Shadow
    // shadowColor: theme.color.violet[700],
    // shadowOffset: {
    //   width: 0,
    //   height: 9,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 9.22,
    // elevation: 12,
  },
  overlay: {
    backgroundColor: "rgba(44, 40, 171, 0.8)",
    bottom: 0,
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  button: {
    position: "absolute",
    right: theme.spacing[3],
    top: theme.spacing[23],
    zIndex: 1,
  },
}));

export default Modal;
