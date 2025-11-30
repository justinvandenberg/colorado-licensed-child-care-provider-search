import { FC, useCallback, useRef, useState } from "react";
import { FlatList, View } from "react-native";

import { Visit } from "@/types/Visit";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useVisits } from "@/providers/VisitsProvider";

import BottomSheetModal, { BottomSheetModalType } from "./ui/BottomSheetModal";
import Button from "./ui/Button";

import VisitBottomSheetModal from "./VisitBottomSheetModal";
import VisitListItem from "./VisitListItem";

const VisitList: FC = () => {
  const { visits, setCurrentVisit, currentVisit, deleteVisits } = useVisits();

  const visitBottomSheetModalRef = useRef<BottomSheetModalType>(null);

  const [selectedVisitIds, setSelectedVisitIds] = useState<Visit["id"][]>([]);

  /**
   * Add or remove visit id from the array of selected visit ids in local state
   * @param id {number} The id of the checkbox
   * @param isChecked {boolean} Wether the checkbox is checked
   */
  const handleCheckboxChange = useCallback((id: number, isChecked: boolean) => {
    setSelectedVisitIds((selectedVisitIds) =>
      isChecked
        ? [...selectedVisitIds, id]
        : selectedVisitIds.filter((i) => i !== id)
    );
  }, []);

  // Open the visit bottom sheet modal
  const openVisitBottomSheetModal = useCallback(() => {
    visitBottomSheetModalRef.current?.present();
  }, []);

  // Close the visit bottom sheet modal
  const closeVisitBottomSheetModal = useCallback(() => {
    visitBottomSheetModalRef.current?.dismiss();
  }, []);

  return (
    <View style={styles.root}>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={visits}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <VisitListItem
            initialCheckboxIsChecked={selectedVisitIds.includes(item.id)}
            onCheckboxChange={(isChecked: boolean) =>
              handleCheckboxChange(item.id, isChecked)
            }
            onPress={() => {
              setCurrentVisit(item);
              openVisitBottomSheetModal();
            }}
            visit={item}
          />
        )}
      />
      <View style={styles.buttonsWrapper}>
        {selectedVisitIds.length > 0 && (
          <Button
            iconName="trash-2"
            onPress={() => {
              deleteVisits(selectedVisitIds);
              setSelectedVisitIds([]);
            }}
            style={styles.deleteButton}
            title={`Delete ${selectedVisitIds.length} visit${
              selectedVisitIds.length > 1 ? "s" : ""
            }`}
          />
        )}
        <Button
          iconOnly={true}
          iconName="plus"
          onPress={() => {
            setCurrentVisit({ title: "" });
            openVisitBottomSheetModal();
          }}
          title="Add a visit"
        />
      </View>
      <BottomSheetModal ref={visitBottomSheetModalRef}>
        {currentVisit && (
          <VisitBottomSheetModal
            onClose={() => {
              setCurrentVisit(undefined);
              closeVisitBottomSheetModal();
            }}
            visit={currentVisit}
          />
        )}
      </BottomSheetModal>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    gap: theme.spacing[2],
    flex: 1,
    paddingBottom: theme.spacing[17],
  },
  contentContainer: {
    gap: theme.spacing[2],
  },
  buttonsWrapper: {
    flexDirection: "row",
    gap: theme.spacing[2],
    justifyContent: "flex-end",
  },
  deleteButton: {
    backgroundColor: theme.color.red[400],
    flexGrow: 1,
  },
}));

export default VisitList;
