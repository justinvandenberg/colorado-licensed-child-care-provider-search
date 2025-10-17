import { FC } from "react";
import { View } from "react-native";

import { createStyleSheet } from "@/utilities/createStyleSheet";

const ProviderMap: FC = () => {
  return <View style={[styles.root]}></View>;
};

const styles = createStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[100],
    borderRadius: theme.spacing[8],
    aspectRatio: "4 / 3",
  },
}));

export default ProviderMap;
