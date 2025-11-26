import { FC } from "react";
import { View } from "react-native";

import { Provider } from "@/types/Provider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useUser } from "@/providers/UserProvider";

import Button from "../ui/Button";
import StaticMap from "../ui/StaticMap";
import Text from "../ui/Text";

import ProviderCapacities from "./ProviderCapacities";
import ProviderContact from "./ProviderContact";
import ProviderStanding from "./ProviderStanding";

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard: FC<ProviderCardProps> = ({ provider }) => {
  const theme = useTheme();
  const { updateCurrentUserFavorites, currentUser } = useUser();
  const { setCurrentProvider } = useProviders();

  return (
    <View style={styles.root}>
      <View style={styles.staticMapWrapper}>
        <StaticMap imageUri={provider.static_map_uri} />
        <Button
          iconOnly={true}
          iconColor={theme.color.red[400]}
          iconName={
            currentUser?.favorites.includes(provider.provider_id)
              ? "heart" // TODO: Need a fill
              : "heart"
          }
          title="Add to favorites"
          onPress={() => {
            if (!currentUser) {
              return;
            }
            updateCurrentUserFavorites(String(provider.provider_id));
          }}
          style={styles.favoriteButton}
        />
      </View>
      <View style={styles.titleWrapper}>
        <ProviderStanding qualityRating={provider.quality_rating} />
        <Text fontSize={20} fontWeight={600}>
          {provider.provider_name}
        </Text>
        <ProviderContact
          address={provider.formatted_address}
          phoneNumber={provider.formatted_phone_number}
          website={provider.website}
        />
      </View>
      <ProviderCapacities
        infantCapacity={provider.licensed_infant_capacity}
        toddlerCapacity={provider.licensed_toddler_capacity}
        preschoolCapacity={provider.licensed_preschool_capacity}
        schoolAgeCapacity={provider.licensed_school_age_capacity}
      />
      <Button
        direction="reverse"
        iconName="arrow-right"
        onPress={() => setCurrentProvider({ ...provider })}
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
    backgroundColor: theme.color.red[100],
    left: theme.spacing[2],
    position: "absolute",
    top: theme.spacing[2],
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
