import { FC } from "react";
import { View } from "react-native";

import { Provider } from "@/types/Provider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Button from "../ui/Button";
import StaticMap from "../ui/StaticMap";
import Text from "../ui/Text";

import ProviderCapacities from "./ProviderCapacities";
import ProviderContact from "./ProviderContact";
import ProviderQualityRating from "./ProviderQualityRating";

const ProviderCard: FC<Provider> = ({
  provider_id,
  provider_name,
  quality_rating,
  licensed_infant_capacity,
  licensed_toddler_capacity,
  licensed_school_age_capacity,
  licensed_preschool_capacity,
  licensed_preschool_and_school_age_capacity,
  street_address,
  city,
  state,
  static_map_uri,
  formatted_phone_number,
  formatted_address,
  website,
}) => {
  return (
    <View style={styles.root}>
      <StaticMap imageUri={static_map_uri} />
      <View style={styles.titleWrapper}>
        <ProviderQualityRating qualityRating={quality_rating} />
        <Text fontSize={20} fontWeight={600} style={styles.title}>
          {provider_name}
        </Text>
        <ProviderContact
          address={formatted_address}
          phoneNumber={formatted_phone_number}
          website={website}
        />
      </View>
      <ProviderCapacities
        infantCapacity={licensed_infant_capacity}
        toddlerCapacity={licensed_toddler_capacity}
        preKCapacity={licensed_preschool_capacity}
        schoolAgeCapacity={licensed_school_age_capacity}
      />
      <Button
        direction="reverse"
        iconName="arrow-right"
        onPress={() => {}}
        style={styles.button}
        title="See more"
        titleStyle={styles.buttonTitle}
        variant="inverted"
      />
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.white,
    borderColor: theme.color.violet[200],
    borderWidth: 1,
    borderRadius: theme.spacing[10],
    flex: 1,
    gap: theme.spacing[2],
    padding: theme.spacing[2],
    paddingBottom: 0,
  },
  titleWrapper: {
    gap: theme.spacing[2],
    marginTop: theme.spacing[1],
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[2],
  },
  title: {
    marginTop: theme.spacing[1],
  },
  button: {
    marginTop: -8,
  },
  buttonTitle: {
    color: theme.color.violet[400],
  },
}));

export default ProviderCard;
