import { View, ViewProps } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

const Inline = ({ children, style, ...props }: ViewProps) => {
  return (
    <View style={[styles.root]} {...props}>
      {children}
    </View>
  );
};

const styles = createThemedStyleSheet(() => ({
  root: {
    alignItems: "center",
    flexDirection: "row",
  },
}));

export default Inline;
