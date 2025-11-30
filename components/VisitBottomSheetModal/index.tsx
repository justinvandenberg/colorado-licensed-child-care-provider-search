import { FC, useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import {
  Visit,
  VisitChecklistItems,
  VisitChecklistValues,
} from "@/types/Visit";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Button from "../ui/Button";
import SmileySlider from "../ui/SmileySlider";
import Text from "../ui/Text";
import TextArea from "../ui/TextArea";
import TextIcon from "../ui/TextIcon";

import { useTheme } from "@/providers/ThemeProvider";
import { useUser } from "@/providers/UserProvider";
import { useVisits } from "@/providers/VisitsProvider";

import { BottomSheetModalProps } from "../ui/BottomSheetModal";

import VisitBottomSheetModalChecklist from "./VisitBottomSheetModalChecklist";
import VisitBottomSheetModalTitle from "./VisitBottomSheetModalTitle";

type VisitBottomSheetModalProps = Omit<BottomSheetModalProps, "children"> & {
  onClose: () => void;
  visit: Visit;
};
const VisitBottomSheetModal: FC<VisitBottomSheetModalProps> = ({
  onClose,
  visit,
}) => {
  const theme = useTheme();
  const { currentUser } = useUser();
  const { updateCurrentVisit, deleteVisits, setCurrentVisit, currentVisit } =
    useVisits();

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
    <View style={styles.root}>
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
      <VisitBottomSheetModalTitle
        initialValue={visit.title}
        label="Visit title"
        onSubmit={setPendingTitle}
      />
      <View style={styles.buttonsWrapper}>
        {visit.id !== undefined && (
          <Button
            iconName="trash-2"
            onPress={() => {
              deleteVisits([visit.id]);
              setCurrentVisit(undefined);
              onClose();
            }}
            style={styles.deleteButton}
            title="Delete"
          />
        )}
        <Button
          iconName="save"
          isDisabled={!pendingTitle}
          onPress={() => {
            updateCurrentVisit(
              {
                ...currentVisit,
                id: visit.id,
                checklist_values:
                  pendingChecklistValues ?? visit.checklist_values,
                title: pendingTitle ?? visit.title,
                user_rating: pendingUserRating ?? visit.user_rating,
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
        <VisitBottomSheetModalChecklist
          checklistItems={HEALTH_AND_SAFETY_ITEMS}
          checklistValues={pendingChecklistValues || visit.checklist_values}
          onChecklistItemChange={handleChecklistChange}
          title="Health and safety"
        />
        <VisitBottomSheetModalChecklist
          checklistItems={DAILY_ACTIVITIES_ITEMS}
          checklistValues={pendingChecklistValues || visit.checklist_values}
          onChecklistItemChange={handleChecklistChange}
          title="Daily activities"
        />
        <VisitBottomSheetModalChecklist
          checklistItems={PROVIDER_INTERACTIONS_ITEMS}
          checklistValues={pendingChecklistValues || visit.checklist_values}
          onChecklistItemChange={handleChecklistChange}
          title="Provider interactions"
        />
        <VisitBottomSheetModalChecklist
          checklistItems={LEARNING_ENVIRONMENT_ITEMS}
          checklistValues={pendingChecklistValues || visit.checklist_values}
          onChecklistItemChange={handleChecklistChange}
          title="Learning environment"
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
      <View style={styles.textAreaWrapper}>
        <Text fontSize={20} fontWeight={600} color={theme.color.violet[400]}>
          Additional notes
        </Text>
        <TextArea isInBottomSheet={true} label="Notes" showLabel={false} />
      </View>
    </View>
  );
};

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

const styles = createThemedStyleSheet((theme) => ({
  root: {
    flex: 1,
    gap: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },
  score: {
    backgroundColor: theme.color.yellow[100],
    // borderWidth: 2,
    // borderColor: theme.color.yellow[400],
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
  textAreaWrapper: {
    gap: theme.spacing[3],
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

export default VisitBottomSheetModal;
