import { View, ViewProps } from "react-native";

import { createStyleSheet } from "@/utilities/createStyleSheet";

const Inline = ({ children, style, ...props }: ViewProps) => {
  return (
    <View style={[styles.root]} {...props}>
      {children}
    </View>
  );
};

const styles = createStyleSheet(() => ({
  root: {
    alignItems: "center",
    flexDirection: "row",
  },
}));

export default Inline;
