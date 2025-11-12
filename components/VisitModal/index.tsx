import { FC } from "react";
import { ScrollView, View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import { addLocalDbVisit } from "@/utilities/localDb";

import { User, Visit } from "@/types/User";

import { useTheme } from "@/providers/ThemeProvider";
import Button from "../ui/Button";
import EditableText from "../ui/EditableText";
import Modal, { ModalProps } from "../ui/Modal";
import SmileySlider from "../ui/SmileySlider";
import Text from "../ui/Text";
import VisitQuestions from "./VisitQuestions";

type VisitModalProps = ModalProps & {
  user: User;
  visit: Visit;
};

const VisitModal: FC<VisitModalProps> = ({
  onClose = () => {},
  user,
  visible = false,
  visit,
}) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} onClose={onClose}>
      <ScrollView>
        <View style={styles.modalWrapper}>
          <EditableText
            label="Visit name"
            value="blah blah blah"
            textInputStyle={styles.titleTextInput}
          />
          <VisitQuestions
            title="Health and safety"
            questions={[
              "Is the program licensed and in good standing with the State of Colorado?",
              "Are supplies, materials, and equipment clean, safe, and in good working order?",
              "Are electrical outlets protected?",
              "Are stairs properly secured?",
              "Are all hazardous items are removed or safely out of children's reach?",
              "Is the outdoor play area (if applicable) is fenced in and safe for children?",
              "Are pets/animals secured, and their food, cages, litter boxes, etc., are separated from children's activity areas?",
            ]}
          />
          <VisitQuestions
            title="Daily activities"
            questions={[
              "Does each day includes playtime, story time, activity time, and rest time?",
              "Do providers actively engage and play with children?",
              "Are a variety of toys and materials (e.g. puzzles, blocks, music instruments, pretend play items) available?",
              "Is screen/technology use (if any) limited, age-appropriate, and intentional?",
            ]}
          />
          <VisitQuestions
            title="Provider interactions"
            questions={[
              "Do providers speak to children warmly, respectfully, and at eye level?",
              "Do providers show genuine interest in what children are doing?",
              "Do providers and children appear to enjoy each other's company?",
              "Do providers listen attentively, encourage children, and use positive feedback?",
              "Do providers respond promptly and sensitively when children are hurt, upset, or need attention?",
            ]}
          />
          <VisitQuestions
            title="Learning environment"
            questions={[
              "Is the environment is pleasant, clean, and well maintained?",
              "Are there distinct areas are designated for quiet play, active play, and rest?",
              "Is furniture and materials are appropriate in size and type for children's ages?",
              "Is the number of toys and learning materials is sufficient for the group size?",
              "Do providers listen attentively, encourage children, and use positive feedback?",
            ]}
          />
          <View style={styles.smileySliderWrapper}>
            <Text
              fontSize={20}
              fontWeight={600}
              color={theme.color.violet[400]}
            >
              How much do you like this place?
            </Text>
            <SmileySlider
              label="How much do you like this place?"
              showLabel={false}
            />
          </View>
          <Button
            onPress={() => {
              if (!user) {
                return;
              }
              addLocalDbVisit(visit, user);
            }}
            // iconName="plus"
            title="Save visit"
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  modalWrapper: {
    gap: theme.spacing[4],
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[12],
    paddingHorizontal: theme.spacing[4],
  },
  titleTextInput: {
    color: theme.color.violet[400],
    fontFamily: "DMSans_600SemiBold",
    fontSize: 28,
  },
  checkboxesWrapper: {
    gap: theme.spacing[1],
  },
  smileySliderWrapper: {
    gap: theme.spacing[4],
  },
}));

export default VisitModal;
