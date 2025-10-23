import { FC, useCallback } from "react";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import * as Location from "expo-location";

import Button from "./Button";

interface LocationButtonProps {
  onLocationPermissionGranted: (zip: string | null) => void;
}

const LocationButton: FC<LocationButtonProps> = ({
  onLocationPermissionGranted,
}) => {
  const getCurrentLocation = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Permission was denied by user");
      }

      let location = await Location.getCurrentPositionAsync({});
      let addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses.length === 0) {
        throw new Error("Zip code could not be found");
      }

      onLocationPermissionGranted?.(addresses[0].postalCode);
    } catch (error) {
      console.warn("Error getting user's location permission:", error);
    }
  }, [onLocationPermissionGranted]);

  return (
    <Button
      iconOnly={true}
      iconName="pin"
      onPress={getCurrentLocation}
      title="Provide current location to find locations nearby"
      style={styles.root}
    />
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[950],
  },
}));

export default LocationButton;
