import { useTheme } from "@/providers/ThemeProvider";
import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import { FC, useMemo } from "react";
import {
  Modal as RnModal,
  ModalProps as RnModalProps,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Button from "./Button";

export type ModalProps = RnModalProps & {
  onClose?: () => void;
  position?: "top" | "center" | "bottom";
};

const Modal: FC<ModalProps> = ({
  children,
  onClose,
  position = "center",
  style,
  visible = false,
  ...props
}) => {
  const theme = useTheme();

  const rootStyle = useMemo(() => {
    let justifyContent = "center";

    if (position === "top") {
      justifyContent = "flex-start";
    }

    if (position === "bottom") {
      justifyContent = "flex-end";
    }

    return {
      justifyContent,
    } as StyleProp<ViewStyle>;
  }, [position]);

  const contentWrapperStyle = useMemo(() => {
    let borderTopLeftRadius = theme.spacing[8];
    let borderTopRightRadius = theme.spacing[8];
    let borderBottomLeftRadius = theme.spacing[8];
    let borderBottomRightRadius = theme.spacing[8];
    let paddingVertical = theme.spacing[4];

    if (position === "top") {
      borderTopLeftRadius = theme.spacing[12];
      borderTopRightRadius = theme.spacing[12];
      borderBottomLeftRadius = theme.spacing[11];
      borderBottomRightRadius = theme.spacing[11];
      paddingVertical = theme.spacing[10];
    }

    if (position === "bottom") {
      borderTopLeftRadius = theme.spacing[11];
      borderTopRightRadius = theme.spacing[11];
      borderBottomLeftRadius = theme.spacing[12];
      borderBottomRightRadius = theme.spacing[12];
      paddingVertical = theme.spacing[10];
    }

    return {
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      // paddingVertical,
    } as StyleProp<ViewStyle>;
  }, [position, theme.spacing]);

  return (
    <RnModal
      animationType="slide"
      transparent={true}
      {...props}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={[styles.root, rootStyle, style]}>
        <View style={[styles.contentWrapper, contentWrapperStyle]}>
          <View style={styles.closeButtonWrapper}>
            <Button
              iconName="x"
              iconOnly={true}
              onPress={() => onClose?.()}
              style={styles.closeButton}
              title="Close"
              variant="inverted"
            />
          </View>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {children}
          </ScrollView>
        </View>
      </View>
    </RnModal>
  );
};

export default Modal;

const styles = createThemedStyleSheet((theme) => ({
  root: {
    flex: 1,
    padding: theme.spacing[2],
  },
  contentWrapper: {
    backgroundColor: theme.color.white,
    borderColor: theme.color.violet[100],
    borderRadius: theme.spacing[8],
    borderWidth: 1,
    padding: theme.spacing[3],
    paddingBottom: theme.spacing[6],
    position: "relative",
    flexShrink: 0,
    // Shadow
    shadowColor: theme.color.violet[700],
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 10,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing[1],
  },
  closeButtonWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    borderRadius: 0,
    padding: theme.spacing[4],
  },
}));
