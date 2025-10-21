import { Image } from "expo-image";
import { FC } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

interface StaticMapProps {
  imageUri: string;
}

const StaticMap: FC<StaticMapProps> = ({ imageUri }) => {
  return (
    <View style={[styles.root]}>
      {imageUri && (
        <Image source={imageUri} contentFit="cover" style={{ flex: 1 }} />
      )}
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    aspectRatio: "4 / 3",
    backgroundColor: theme.color.violet[100],
    borderRadius: theme.spacing[8],
    overflow: "hidden",
  },
}));

export default StaticMap;
