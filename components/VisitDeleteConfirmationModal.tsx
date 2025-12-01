import { FC } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Button from "./ui/Button";
import Modal, { ModalProps } from "./ui/Modal";
import Text from "./ui/Text";

type VisitDeleteConfirmationModalProps = ModalProps & {
  onClose: () => void;
  onDelete: () => void;
};
const VisitDeleteConfirmationModal: FC<VisitDeleteConfirmationModalProps> = ({
  onClose,
  onDelete,
  ...props
}) => {
  return (
    <Modal {...props} position="bottom" onClose={onClose}>
      <View style={styles.root}>
        <Text fontWeight={600}>
          Are you sure you want to delete this visit?
        </Text>
        <Text>This action cannot be undone. </Text>
        <View style={styles.buttonsWrapper}>
          <Button
            iconName="x"
            onPress={onClose}
            style={styles.secondaryCloseButton}
            title="No, close"
          />
          <Button
            iconName="trash-2"
            onPress={onDelete}
            style={styles.deleteButton}
            title="Yes, delete"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    gap: theme.spacing[2],
  },
  buttonsWrapper: {
    paddingTop: theme.spacing[2],
    gap: theme.spacing[2],
  },
  secondaryCloseButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: theme.color.red[400],
  },
}));

export default VisitDeleteConfirmationModal;
