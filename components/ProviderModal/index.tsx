import { FC } from "react";
import { ScrollView, View } from "react-native";

import { Provider } from "@/types/Provider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Modal, { ModalProps } from "../ui/Modal";
import StaticMap from "../ui/StaticMap";
import Text from "../ui/Text";

import { useProviders } from "@/providers/ProvidersProvider";
import ProviderCapacities from "../ProviderCard/ProviderCapacities";
import ProviderContact from "../ProviderCard/ProviderContact";
import ProviderQualityRating from "../ProviderCard/ProviderStanding";
import ProviderDetails from "./ProviderDetails";

type ProviderModalProps = ModalProps & { provider: Provider };

const ProviderModal: FC<ProviderModalProps> = ({
  provider,
  visible = false,
}) => {
  const { setCurrentProvider } = useProviders();

  return (
    <Modal visible={visible} onClose={() => setCurrentProvider(null)}>
      <ScrollView style={styles.root}>
        <View style={styles.modalWrapper}>
          <View style={styles.titleWrapper}>
            <ProviderQualityRating qualityRating={provider.quality_rating} />
            <Text fontSize={28} fontWeight={600}>
              {provider.provider_name}
            </Text>
            <ProviderContact
              address={provider.formatted_address}
              orientation="vertical"
              phoneNumber={provider.formatted_phone_number}
              website={provider.website}
            />
          </View>
          <StaticMap imageUri={provider.static_map_uri} />
          <ProviderCapacities
            infantCapacity={provider.licensed_infant_capacity}
            toddlerCapacity={provider.licensed_toddler_capacity}
            preschoolCapacity={provider.licensed_preschool_capacity}
            schoolAgeCapacity={provider.licensed_school_age_capacity}
          />
          <ProviderDetails
            title="Additional info"
            listItems={{
              "Setting:": provider.provider_service_type,
              "School district:": provider.school_district,
              "School district operated:": valueToYesNo(
                provider.school_district_operated_program
              ),
              "CCCAP authorized:": valueToYesNo(
                provider.cccap_authorization_status
              ),
              "Colorado Shines quality rating:": provider.quality_rating,
            }}
          />
          <ProviderDetails
            title="Capacity"
            listItems={{
              "Total capacity:": String(provider.total_licensed_capacity || 0),
              "Infant capacity:": String(
                provider.licensed_infant_capacity || 0
              ),
              "Toddler capacity:": String(
                provider.licensed_toddler_capacity || 0
              ),
              "Preschool capacity:": String(
                provider.licensed_preschool_capacity || 0
              ),
              "School age capacity:": String(
                provider.licensed_school_age_capacity || 0
              ),
              "Resident camp capacity:": String(
                provider.licensed_resident_camp_capacity || 0
              ),
              "Home capacity:": String(provider.licensed_home_capacity || 0),
            }}
          />
          <ProviderDetails
            title="Licensing"
            listItems={{
              "License number:": provider.provider_id,
              "Award date:": String(provider.award_date),
              "Expiration date:": String(provider.expiration_date),
              "Governing body:": provider.governing_body,
            }}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[12],
    paddingHorizontal: theme.spacing[2],
  },
  modalWrapper: {
    gap: theme.spacing[4],
  },
  titleWrapper: {
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
  },
}));

/**
 * Translate value to "Yes" or "No"
 * @param value {unknown} The value to translate
 * @returns string
 */
const valueToYesNo = (value: unknown) => {
  return !!value ? "Yes" : "No";
};

export default ProviderModal;
