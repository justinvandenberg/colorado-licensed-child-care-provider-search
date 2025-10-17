import { FC } from "react";
import { View } from "react-native";

import { theme } from "@/constants/theme";

import { createStyleSheet } from "@/utilities/createStyleSheet";

import Text from "./Text";

interface ProviderCapacityProps {
  title: string;
  count?: number;
}

const ProviderCapacity: FC<ProviderCapacityProps> = ({ title, count = 0 }) => {
  return (
    <View style={[styles.root]}>
      <Text color={theme.color.white} fontSize={14}>
        {title}
      </Text>
      <Text color={theme.color.white} fontSize={24} fontWeight={600}>
        {count}
      </Text>
    </View>
  );
};

const styles = createStyleSheet((theme) => ({
  root: {
    aspectRatio: "1 / 1",
    backgroundColor: theme.color.violet[400],
    borderRadius: theme.spacing[6],
    justifyContent: "flex-end",
    padding: theme.spacing[3],
    paddingBottom: theme.spacing[2],
  },
}));

export default ProviderCapacity;
