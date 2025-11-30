import { FC, useCallback } from "react";
import { View } from "react-native";

import { Provider } from "@/types/Provider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";
import { useUser } from "@/providers/UserProvider";

import Button from "../ui/Button";
import StaticMap from "../ui/StaticMap";
import Text from "../ui/Text";

import Svg, { Path } from "react-native-svg";
import ProviderCardCapacities from "./ProviderCardCapacities";
import ProviderCardContact from "./ProviderCardContact";
import ProviderCardQualityRating from "./ProviderCardQualityRating";

// import HeartFillIcon from "@/assets/images/heart-fill.svg";
// import HeartIcon from "@/assets/images/heart.svg";

interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
}

const ProviderCard: FC<ProviderCardProps> = ({ provider, onPress }) => {
  const theme = useTheme();
  const { updateCurrentUserFavorites, currentUser } = useUser();

  const HeartIcon = useCallback(() => {
    return (
      <Svg width="22" height="22" viewBox="0 0 768 768" fill="none">
        <Path
          d="M644.256 170.144C672.416 198.336 686.464 235.136 686.464 272.032C686.464 308.928 672.384 345.728 644.256 373.856L384 634.112L123.744 373.856C95.616 345.728 81.568 308.928 81.568 272C81.568 235.072 95.616 198.272 123.744 170.144C151.872 142.016 188.672 127.968 225.6 127.968C262.528 127.968 299.328 142.016 327.456 170.144L361.376 204.064C373.888 216.576 394.144 216.576 406.624 204.064L440.608 170.08C468.736 141.952 505.536 127.904 542.432 127.936C579.328 127.968 616.128 142.016 644.256 170.144ZM689.504 124.896C648.896 84.288 595.616 63.968 542.432 63.936C489.248 63.904 435.968 84.224 395.328 124.832L384 136.192L372.704 124.896C332.096 84.288 278.784 63.968 225.6 63.968C172.416 63.968 119.104 84.288 78.496 124.896C37.888 165.504 17.568 218.816 17.568 272C17.568 325.184 37.888 378.496 78.496 419.104L361.376 701.984C373.888 714.496 394.144 714.496 406.624 701.984L689.504 419.104C730.112 378.496 750.432 325.216 750.464 272.032C750.496 218.848 730.176 165.568 689.504 124.896Z"
          fill={theme.color.red[400]}
        />
      </Svg>
    );
  }, [theme.color.red]);

  const HeartFillIcon = useCallback(() => {
    return (
      <Svg width="22" height="22" viewBox="0 0 768 768" fill="none">
        <Path
          d="M689.504 124.896C648.896 84.288 595.616 63.968 542.432 63.936C489.248 63.904 435.968 84.224 395.328 124.832L384 136.192L372.704 124.896C332.096 84.288 278.784 63.968 225.6 63.968C172.416 63.968 119.104 84.288 78.496 124.896C37.888 165.504 17.568 218.816 17.568 272C17.568 325.184 37.888 378.496 78.496 419.104L361.376 701.984C373.888 714.496 394.144 714.496 406.624 701.984L689.504 419.104C730.112 378.496 750.432 325.216 750.464 272.032C750.496 218.848 730.176 165.568 689.504 124.896Z"
          fill={theme.color.red[400]}
        />
      </Svg>
    );
  }, [theme.color.red]);

  return (
    <View style={styles.root}>
      <View style={styles.staticMapWrapper}>
        <StaticMap imageUri={provider.static_map_uri} />
        <Button
          iconOnly={true}
          SvgIcon={
            currentUser?.favorites.includes(provider.provider_id)
              ? HeartFillIcon
              : HeartIcon
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
        <ProviderCardQualityRating qualityRating={provider.quality_rating} />
        <Text fontSize={20} fontWeight={600}>
          {provider.provider_name}
        </Text>
        <ProviderCardContact
          address={provider.formatted_address}
          phoneNumber={provider.formatted_phone_number}
          website={provider.website}
        />
      </View>
      <ProviderCardCapacities
        infantCapacity={provider.licensed_infant_capacity}
        toddlerCapacity={provider.licensed_toddler_capacity}
        preschoolCapacity={provider.licensed_preschool_capacity}
        schoolAgeCapacity={provider.licensed_school_age_capacity}
      />
      <Button
        direction="reverse"
        iconName="arrow-right"
        onPress={onPress}
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
