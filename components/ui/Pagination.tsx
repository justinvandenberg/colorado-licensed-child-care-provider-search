import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Button from "./Button";

interface PaginationProps {
  onNext: () => void;
  onPrev: () => void;
}

const Pagination = ({ onNext, onPrev }: PaginationProps) => {
  return (
    <View style={[styles.root]}>
      <Button iconName="arrow-left" title="Previous" onPress={onPrev} />
      <Button
        direction="reverse"
        iconName="arrow-right"
        title="Next"
        onPress={onNext}
      />
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    flexDirection: "row",
    gap: theme.spacing[2],
  },
}));

export default Pagination;
