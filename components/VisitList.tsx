import { FC, useCallback, useState } from "react";
import { FlatList, View } from "react-native";

import { Visit } from "@/types/Visit";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useVisits } from "@/providers/VisitsProvider";

import Button from "./ui/Button";

import VisitListItem from "./VisitListItem";
import VisitModal from "./VisitModal";

const VisitList: FC = () => {
  const { visits, setCurrentVisit, currentVisit } = useVisits();

  const [selectedVisitIds, setSelectedVisitIds] = useState<Visit["id"][]>([]);

  /**
   * Add or remove visit id from the array of selected visit ids
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
            visit={item}
          />
        )}
      />
      <View style={styles.buttonsWrapper}>
        {selectedVisitIds.length > 0 && (
          <Button
            iconName="trash-2"
            onPress={() => {
              console.log("del");
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
          }}
          title="Add a visit"
        />
      </View>
      {currentVisit !== undefined && (
        <VisitModal
          key={currentVisit.id ?? "new"}
          onClose={() => setCurrentVisit(undefined)}
          visit={currentVisit}
          visible={!!currentVisit}
        />
      )}
    </View>
  );
};

export default VisitList;

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
