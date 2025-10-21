import { FC } from "react";
import { View } from "react-native";

import { Provider } from "@/types/Provider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Button from "../ui/Button";
import StaticMap from "../ui/StaticMap";
import Text from "../ui/Text";

import ProviderCapacity from "./ProviderCapacity";
import ProviderQualityRating from "./ProviderQualityRating";

const ProviderCard: FC<Provider> = ({
  provider_id,
  provider_name,
  quality_rating,
  licensed_infant_capacity,
  licensed_toddler_capacity,
  licensed_school_age_capacity,
  licensed_preschool_and_school_age_capacity,
  street_address,
  city,
  state,
  static_map_uri,
}) => {
  return (
    <View style={styles.root}>
      <StaticMap imageUri={static_map_uri} />
      <View style={styles.titleWrapper}>
        <ProviderQualityRating qualityRating={quality_rating} />
        <Text fontSize={20} fontWeight={600} style={styles.title}>
          {provider_name}
        </Text>
        <Button
          iconName="location"
          onPress={() => {}}
          size="compact"
          title="Open in maps"
        />
      </View>
      <View style={styles.capacities}>
        <View style={styles.capacity}>
          <ProviderCapacity title="Infant" count={licensed_infant_capacity} />
        </View>
        <View style={styles.capacity}>
          <ProviderCapacity title="Toddler" count={licensed_toddler_capacity} />
        </View>
        <View style={styles.capacity}>
          <ProviderCapacity title="PreK" count={licensed_school_age_capacity} />
        </View>
        <View style={styles.capacity}>
          <ProviderCapacity
            title="K-12"
            count={licensed_preschool_and_school_age_capacity}
          />
        </View>
      </View>
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
  capacities: {
    backgroundColor: theme.color.violet[100],
    borderRadius: theme.spacing[8],
    flexDirection: "row",
    gap: theme.spacing[1],
    padding: theme.spacing[2],
  },
  capacity: {
    flex: 1,
  },
  button: {
    marginTop: -8,
  },
  buttonTitle: {
    color: theme.color.violet[400],
  },
}));

export default ProviderCard;
