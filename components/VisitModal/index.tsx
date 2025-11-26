import { FC, useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import {
  Visit,
  VisitChecklistItems,
  VisitChecklistValues,
} from "@/types/Visit";

import { useTheme } from "@/providers/ThemeProvider";
import { useUser } from "@/providers/UserProvider";
import { useVisits } from "@/providers/VisitsProvider";

import Button from "../ui/Button";
import EditableText from "../ui/EditableText";
import Modal, { ModalProps } from "../ui/Modal";
import SmileySlider from "../ui/SmileySlider";
import Text from "../ui/Text";
import TextIcon from "../ui/TextIcon";

import VisitChecklist from "./VisitChecklist";

type VisitModalProps = ModalProps & { visit: Visit };

const HEALTH_AND_SAFETY_ITEMS: VisitChecklistItems = {
  1: "Is the program licensed and in good standing with the State of Colorado?",
  2: "Are supplies, materials, and equipment clean, safe, and in good working order?",
  3: "Are electrical outlets protected?",
  4: "Are stairs properly secured?",
  5: "Are all hazardous items are removed or safely out of children's reach?",
  6: "Is the outdoor play area (if applicable) is fenced in and safe for children?",
  7: "Are pets/animals secured, and their food, cages, litter boxes, etc., are separated from children's activity areas?",
};

const DAILY_ACTIVITIES_ITEMS: VisitChecklistItems = {
  8: "Does each day includes playtime, story time, activity time, and rest time?",
  9: "Do providers actively engage and play with children?",
  10: "Are a variety of toys and materials (e.g. puzzles, blocks, music instruments, pretend play items) available?",
  11: "Is screen/technology use (if any) limited, age-appropriate, and intentional?",
};

const PROVIDER_INTERACTIONS_ITEMS: VisitChecklistItems = {
  12: "Do providers speak to children warmly, respectfully, and at eye level?",
  13: "Do providers show genuine interest in what children are doing?",
  14: "Do providers and children appear to enjoy each other's company?",
  15: "Do providers listen attentively, encourage children, and use positive feedback?",
  16: "Do providers respond sensitively when children are hurt, upset, or need attention?",
};

const LEARNING_ENVIRONMENT_ITEMS: VisitChecklistItems = {
  17: "Is the environment is pleasant, clean, and well maintained?",
  18: "Are there distinct areas are designated for quiet play, active play, and rest?",
  19: "Is furniture and materials are appropriate in size and type for children's ages?",
  20: "Is the number of toys and learning materials is sufficient for the group size?",
  21: "Do providers listen attentively, encourage children, and use positive feedback?",
};

const VisitModal: FC<VisitModalProps> = ({
  onClose = () => {},
  visit,
  visible = false,
}) => {
  const theme = useTheme();
  const { currentUser } = useUser();
  const { updateCurrentVisit, deleteVisits, currentVisit } = useVisits();

  const [pendingTitle, setPendingTitle] = useState<string>();
  const [pendingChecklistValues, setPendingChecklistValues] =
    useState<VisitChecklistValues>();
  const [pendingUserRating, setPendingUserRating] = useState<number>();

  /**
   * Update the pending checklist values
   * @param id {number} The id of the checklist item
   * @param value {boolean} The value of the checklist item
   */
  const handleChecklistChange = useCallback((id: number, value: boolean) => {
    setPendingChecklistValues((checklistValues) => ({
      ...checklistValues,
      [id]: value,
    }));
  }, []);

  useEffect(() => {
    setPendingTitle(visit.title);
    setPendingChecklistValues(visit.checklist_values);
    setPendingUserRating(visit.user_rating);
  }, [visit.title, visit.checklist_values, visit.user_rating]);

  return (
    <Modal visible={visible} onClose={onClose} showCloseButton={false}>
      <View style={styles.modalWrapper}>
        <View style={styles.scoreWrapper}>
          <TextIcon
            iconColor={theme.color.yellow[400]}
            iconName="star"
            iconSize={24}
            style={styles.score}
            title={`${visit.score || "—"}`}
            titleColor={theme.color.yellow[700]}
            titleSize={20}
            titleWeight={600}
          />
          <Button
            iconName="x"
            iconOnly={true}
            onPress={onClose}
            size="compact"
            style={styles.closeButton}
            title="Close modal"
            variant="inverted"
          />
        </View>
        <EditableText
          initialValue={visit.title}
          label="Visit title"
          onSubmit={setPendingTitle}
          fontSize={28}
          fontWeight={600}
        />
        <View style={styles.buttonsWrapper}>
          {visit.id !== undefined && (
            <Button
              iconName="trash-2"
              onPress={() => {
                deleteVisits([visit.id]);
                onClose();
              }}
              style={styles.deleteButton}
              title="Delete"
            />
          )}
          <Button
            iconName="save"
            onPress={() => {
              updateCurrentVisit(
                {
                  ...currentVisit,
                  id: visit.id,
                  checklist_values:
                    pendingChecklistValues || visit.checklist_values,
                  title: pendingTitle || visit.title,
                  user_rating:
                    pendingUserRating !== undefined
                      ? pendingUserRating
                      : visit.user_rating,
                },
                currentUser?.id
              );
              onClose();
            }}
            style={styles.saveButton}
            title="Save"
          />
        </View>
        <View style={styles.checkboxesWrapper}>
          <VisitChecklist
            items={HEALTH_AND_SAFETY_ITEMS}
            onChange={handleChecklistChange}
            title="Health and safety"
            values={pendingChecklistValues || visit.checklist_values}
          />
          <VisitChecklist
            items={DAILY_ACTIVITIES_ITEMS}
            onChange={handleChecklistChange}
            title="Daily activities"
            values={pendingChecklistValues || visit.checklist_values}
          />
          <VisitChecklist
            items={PROVIDER_INTERACTIONS_ITEMS}
            onChange={handleChecklistChange}
            title="Provider interactions"
            values={pendingChecklistValues || visit.checklist_values}
          />
          <VisitChecklist
            items={LEARNING_ENVIRONMENT_ITEMS}
            onChange={handleChecklistChange}
            title="Learning environment"
            values={pendingChecklistValues || visit.checklist_values}
          />
        </View>
        <View style={styles.smileySliderWrapper}>
          <Text fontSize={20} fontWeight={600} color={theme.color.violet[400]}>
            How much do you like this place?
          </Text>
          <SmileySlider
            label="How much do you like this place?"
            onPanEnd={setPendingUserRating}
            showLabel={false}
            initialValue={visit.user_rating}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  modalWrapper: {
    gap: theme.spacing[6],
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[12],
  },
  scoreWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  score: {
    backgroundColor: theme.color.yellow[100],
    borderWidth: 2,
    borderColor: theme.color.yellow[400],
    borderRadius: theme.spacing[6],
    paddingVertical: theme.spacing[4], // Needed for override
    paddingHorizontal: theme.spacing[4],
  },
  closeButton: {
    marginRight: -theme.spacing[1],
  },
  checkboxesWrapper: {
    gap: theme.spacing[4],
  },
  smileySliderWrapper: {
    gap: theme.spacing[4],
  },
  buttonsWrapper: {
    flexDirection: "row",
    gap: theme.spacing[2],
  },
  saveButton: {
    flexGrow: 1,
  },
  deleteButton: {
    backgroundColor: theme.color.red[400],
    flexGrow: 1,
  },
}));

export default VisitModal;
