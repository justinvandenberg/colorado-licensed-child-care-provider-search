import { FC, useMemo } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import Button from "../ui/Button";

type ProviderContactProps = {
  address: string;
  orientation?: "horizontal" | "vertical";
  phoneNumber?: string;
  website?: string;
};

const ProviderContact: FC<ProviderContactProps> = ({
  address,
  orientation = "horizontal",
  phoneNumber,
  website,
}) => {
  const theme = useTheme();
  const formattedAddress = useMemo(() => {
    if (!address) {
      return "";
    }

    let addressParts = address.replace(", USA", "").split(", ");
    const addressLine1 = addressParts[0];
    const addressLine2 = `${addressParts[1]}, ${addressParts[2]}`;

    return [addressLine1, addressLine2].join("\n");
  }, [address]);

  return (
    <View
      style={[
        {
          gap:
            orientation === "horizontal" ? theme.spacing[4] : theme.spacing[1],
          flexDirection: orientation === "vertical" ? "column" : "row",
        },
      ]}
    >
      {website && (
        <Button
          iconName="browser"
          onPress={() => {}}
          size="compact"
          style={styles.button}
          title="Website"
          titleWeight={500}
          variant="inverted"
        />
      )}
      {phoneNumber && (
        <Button
          iconName="device-mobile"
          onPress={() => {}}
          size="compact"
          style={styles.button}
          title={orientation === "horizontal" ? "Phone" : phoneNumber}
          titleWeight={500}
          variant="inverted"
        />
      )}
      <Button
        iconName="location"
        onPress={() => {}}
        size="compact"
        style={[styles.button]}
        title={orientation === "horizontal" ? "Maps" : formattedAddress}
        titleWeight={500}
        variant="inverted"
      />
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  button: {
    paddingRight: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 0,
  },
}));

export default ProviderContact;
