import { FC } from "react";
import { View } from "react-native";

import { Provider } from "@/types/Provider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";
import { useUser } from "@/providers/UserProvider";

import Button from "../ui/Button";
import StaticMap from "../ui/StaticMap";
import Text from "../ui/Text";

import ProviderCapacities from "./ProviderCapacities";
import ProviderContact from "./ProviderContact";
import ProviderStanding from "./ProviderStanding";

type ProviderCardProps = {
  onProviderDetails: () => void;
} & Provider;

const ProviderCard: FC<ProviderCardProps> = ({
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
  onProviderDetails,
}) => {
  const theme = useTheme();
  const { updateUserFavorites, user } = useUser();

  return (
    <View style={styles.root}>
      <View style={styles.staticMapWrapper}>
        <StaticMap imageUri={static_map_uri} />
        <Button
          iconOnly={true}
          iconColor={theme.color.red[400]}
          iconName={
            user?.favorites.includes(provider_id) ? "heart-fill" : "heart"
          }
          title="Add to favorites"
          onPress={() => {
            if (!user) {
              return;
            }
            updateUserFavorites(String(provider_id), user);
          }}
          style={styles.favoriteButton}
        />
      </View>
      <View style={styles.titleWrapper}>
        <ProviderStanding qualityRating={quality_rating} />
        <Text fontSize={20} fontWeight={600}>
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
        preschoolCapacity={licensed_preschool_capacity}
        schoolAgeCapacity={licensed_school_age_capacity}
      />
      <Button
        direction="reverse"
        iconName="arrow-right"
        onPress={onProviderDetails}
        title="See more"
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
    gap: theme.spacing[1],
    padding: theme.spacing[2],
    paddingBottom: 0,
    // Shadow
    // shadowColor: theme.color.violet[700],
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.17,
    // shadowRadius: 3.05,
    // elevation: 4,
  },
  staticMapWrapper: {
    position: "relative",
  },
  favoriteButton: {
    position: "absolute",
    top: theme.spacing[2],
    left: theme.spacing[2],
    backgroundColor: theme.color.red[100],
  },
  titleWrapper: {
    gap: theme.spacing[2],
    padding: theme.spacing[2],
    paddingTop: theme.spacing[1],
  },
  buttonTitle: {
    color: theme.color.violet[400],
  },
}));

export default ProviderCard;
