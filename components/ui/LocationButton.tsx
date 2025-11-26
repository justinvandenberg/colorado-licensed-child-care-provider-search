import * as Location from "expo-location";
import { FC, useCallback } from "react";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Button from "./Button";

interface LocationButtonProps {
  isDisabled?: boolean;
  onLocationPermissionGranted: (zip: string | null) => void;
}

const LocationButton: FC<LocationButtonProps> = ({
  isDisabled = false,
  onLocationPermissionGranted,
}) => {
  // Request current location from user
  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Permission was denied by user");
      }

      const location = await Location.getCurrentPositionAsync({});
      const addresses = await Location.reverseGeocodeAsync({
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
      disabled={isDisabled}
      iconOnly={true}
      iconName="crosshair"
      onPress={getCurrentLocation}
      style={styles.root}
      title="Provide current location to find locations nearby"
    />
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[950],
  },
}));

export default LocationButton;
