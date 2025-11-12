import { FC } from "react";
import { View } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Checkbox from "../ui/Checkbox";
import Text from "../ui/Text";

interface VisitQuestionsProps {
  questions: string[];
  title: string;
}

const VisitQuestions: FC<VisitQuestionsProps> = ({ questions, title }) => {
  const theme = useTheme();

  return (
    <View>
      <Text color={theme.color.violet[400]} fontSize={20} fontWeight={600}>
        {title}
      </Text>
      <View style={styles.questions}>
        {questions.map((question) => (
          <Checkbox key={question} direction="reverse" label={question} />
        ))}
      </View>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  questions: {
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
}));

export default VisitQuestions;
