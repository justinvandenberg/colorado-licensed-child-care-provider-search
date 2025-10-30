import { useProviders } from "@/providers/ProvidersProvider";
import { ScrollView, View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Modal from "../ui/Modal";
import StaticMap from "../ui/StaticMap";
import Text from "../ui/Text";

import ProviderCapacities from "../ProviderCard/ProviderCapacities";
import ProviderContact from "../ProviderCard/ProviderContact";
import ProviderQualityRating from "../ProviderCard/ProviderStanding";
import ProviderDetails from "./ProviderDetails";

const ProviderModal = () => {
  const { currentProvider, setCurrentProvider } = useProviders();

  return (
    <Modal visible={!!currentProvider} onClose={() => setCurrentProvider(null)}>
      <ScrollView style={styles.root}>
        {currentProvider && (
          <View style={styles.modalContent}>
            <View style={styles.titleWrapper}>
              <ProviderQualityRating
                qualityRating={currentProvider.quality_rating}
              />
              <Text fontSize={28} fontWeight={600}>
                {currentProvider.provider_name}
              </Text>
              <ProviderContact
                address={currentProvider.formatted_address}
                orientation="vertical"
                phoneNumber={currentProvider.formatted_phone_number}
                website={currentProvider.website}
              />
            </View>
            <StaticMap imageUri={currentProvider.static_map_uri} />
            <ProviderCapacities
              infantCapacity={currentProvider.licensed_infant_capacity}
              toddlerCapacity={currentProvider.licensed_toddler_capacity}
              preschoolCapacity={currentProvider.licensed_preschool_capacity}
              schoolAgeCapacity={currentProvider.licensed_school_age_capacity}
            />
            <ProviderDetails
              title="Additional info"
              iconName="info"
              listItems={{
                "Setting:": currentProvider.provider_service_type,
                "School district:": currentProvider.school_district,
                "School district operated:": valueToYesNo(
                  currentProvider.school_district_operated_program
                ),
                "CCCAP authorized:": valueToYesNo(
                  currentProvider.cccap_authorization_status
                ),
                "Colorado Shines quality rating:":
                  currentProvider.quality_rating,
              }}
            />
            <ProviderDetails
              title="Capacity"
              iconName="people"
              listItems={{
                "Total capacity:": String(
                  currentProvider.total_licensed_capacity || 0
                ),
                "Infant capacity:": String(
                  currentProvider.licensed_infant_capacity || 0
                ),
                "Toddler capacity:": String(
                  currentProvider.licensed_toddler_capacity || 0
                ),
                "Preschool capacity:": String(
                  currentProvider.licensed_preschool_capacity || 0
                ),
                "School age capacity:": String(
                  currentProvider.licensed_school_age_capacity || 0
                ),
                "Resident camp capacity:": String(
                  currentProvider.licensed_resident_camp_capacity || 0
                ),
                "Home capacity:": String(
                  currentProvider.licensed_home_capacity || 0
                ),
              }}
            />
            <ProviderDetails
              title="Licensing"
              iconName="file-badge"
              listItems={{
                "License number:": currentProvider.provider_id,
                "Award date:": String(currentProvider.award_date),
                "Expiration date:": String(currentProvider.expiration_date),
                "Governing body:": currentProvider.governing_body,
              }}
            />
          </View>
        )}
      </ScrollView>
    </Modal>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[12],
    paddingHorizontal: theme.spacing[2],
  },
  modalContent: {
    gap: theme.spacing[4],
  },
  titleWrapper: {
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
  },
}));

const valueToYesNo = (value: unknown) => {
  return !!value ? "Yes" : "No";
};

export default ProviderModal;
