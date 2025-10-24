import * as Location from "expo-location";
import { FC, useCallback } from "react";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Button from "./Button";

interface LocationButtonProps {
  disabled?: boolean;
  onLocationPermissionGranted: (zip: string | null) => void;
}

const LocationButton: FC<LocationButtonProps> = ({
  disabled = false,
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
      disabled={disabled}
      iconOnly={true}
      iconName="location"
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
