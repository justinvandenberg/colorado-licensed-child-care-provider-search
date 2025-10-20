import { Image } from "expo-image";
import { FC } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useMapbox } from "@/hooks/useMapbox";

interface MapboxStaticImageProps {
  id: string;
  streetAddress: string;
  city: string;
  state: string;
}

const MapboxStaticImage: FC<MapboxStaticImageProps> = ({
  id,
  streetAddress,
  city,
  state,
}) => {
  const { imageUri } = useMapbox({
    id,
    streetAddress,
    city,
    state,
  });

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

export default MapboxStaticImage;
