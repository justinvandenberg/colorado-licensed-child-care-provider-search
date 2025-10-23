import { FC } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

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
  return (
    <View style={styles.root}>
      {website && (
        <Button
          iconName="browser"
          onPress={() => {}}
          size="compact"
          style={styles.button}
          title="Website"
          variant="inverted"
        />
      )}
      {phoneNumber && (
        <Button
          iconName="device-mobile"
          onPress={() => {}}
          size="compact"
          style={styles.button}
          title={phoneNumber}
          variant="inverted"
        />
      )}
      <Button
        iconName="location"
        onPress={() => {}}
        size="compact"
        style={styles.button}
        title="Maps"
        variant="inverted"
      />
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    flexDirection: "row",
    gap: theme.spacing[4],
  },
  button: {
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
}));

export default ProviderContact;
