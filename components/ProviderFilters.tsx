import Octicons from "@expo/vector-icons/Octicons";
import { FC, useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import { useProviders } from "@/providers/ProvidersProvider";
import { ProviderFilters as ProviderFiltersType } from "@/types/Provider";
import Button from "./ui/Button";
import Checkbox from "./ui/Checkbox";
import Text from "./ui/Text";

interface ProviderFiltersProps {
  disabled?: boolean;
}

const ProviderFilters: FC<ProviderFiltersProps> = ({ disabled = false }) => {
  const theme = useTheme();
  const { providerFilters, applyProviderFilters } = useProviders();
  const [_providerFilters, _setProviderFilters] =
    useState<ProviderFiltersType>(providerFilters);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const updateProviderFilter = useCallback(
    (key: keyof ProviderFiltersType, value: boolean) => {
      _setProviderFilters((providerFilters) => ({
        ...providerFilters,
        [key]: value,
      }));
    },
    []
  );

  return (
    <View style={styles.root}>
      {isOpen && (
        <View style={styles.checkboxesWrapper}>
          <TouchableOpacity
            onPress={() =>
              updateProviderFilter(
                "only_favs",
                !_providerFilters?.["only_favs"]
              )
            }
            style={styles.heartCheckbox}
          >
            {!!_providerFilters?.["only_favs"] ? (
              <Octicons
                color={theme.color.red[400]}
                name="heart-fill"
                size={24}
              />
            ) : (
              <Octicons color={theme.color.red[400]} name="heart" size={24} />
            )}
            <Text fontWeight={500} style={styles.heartCheckboxLabel}>
              Only favorites?
            </Text>
          </TouchableOpacity>
          <View style={styles.checkboxWrapper}>
            <Text
              fontSize={18}
              fontWeight={600}
              color={theme.color.violet[400]}
            >
              Capacity
            </Text>
            <Checkbox
              label="Infant"
              direction="reverse"
              isChecked={!!_providerFilters?.licensed_infant_capacity}
              onChange={(value) =>
                updateProviderFilter("licensed_infant_capacity", value)
              }
            />
            <Checkbox
              label="Toddler"
              direction="reverse"
              isChecked={!!_providerFilters?.licensed_toddler_capacity}
              onChange={(value) =>
                updateProviderFilter("licensed_toddler_capacity", value)
              }
            />
            <Checkbox
              label="PreK"
              direction="reverse"
              isChecked={!!_providerFilters?.licensed_preschool_capacity}
              onChange={(value) =>
                updateProviderFilter("licensed_preschool_capacity", value)
              }
            />
            <Checkbox
              label="K-12"
              direction="reverse"
              isChecked={!!_providerFilters?.licensed_school_age_capacity}
              onChange={(value) =>
                updateProviderFilter("licensed_school_age_capacity", value)
              }
            />
          </View>
          <View style={styles.checkboxWrapper}>
            <Text
              fontSize={18}
              fontWeight={600}
              color={theme.color.violet[400]}
            >
              Setting
            </Text>
            <Checkbox
              label="Child care center"
              direction="reverse"
              isChecked={
                !!_providerFilters?.["provider_service_type.Child Care Center"]
              }
              onChange={(value) =>
                updateProviderFilter(
                  "provider_service_type.Child Care Center",
                  value
                )
              }
            />
            <Checkbox
              label="Preschool program"
              direction="reverse"
              isChecked={
                !!_providerFilters?.["provider_service_type.Preschool Program"]
              }
              onChange={(value) =>
                updateProviderFilter(
                  "provider_service_type.Preschool Program",
                  value
                )
              }
            />
            <Checkbox
              label="School age program"
              direction="reverse"
              isChecked={
                !!_providerFilters?.[
                  "provider_service_type.School-Age Child Care Center"
                ]
              }
              onChange={(value) =>
                updateProviderFilter(
                  "provider_service_type.School-Age Child Care Center",
                  value
                )
              }
            />
            <Checkbox
              label="Family child care"
              direction="reverse"
              isChecked={
                !!_providerFilters?.[
                  "provider_service_type.Large Family Child Care Home"
                ]
              }
              onChange={(value) =>
                updateProviderFilter(
                  "provider_service_type.Large Family Child Care Home",
                  value
                )
              }
            />
            <Checkbox
              label="Neighborhood youth organization"
              direction="reverse"
              isChecked={
                !!_providerFilters?.[
                  "provider_service_type.Neighborhood Youth Organization"
                ]
              }
              onChange={(value) =>
                updateProviderFilter(
                  "provider_service_type.Neighborhood Youth Organization",
                  value
                )
              }
            />
          </View>

          <View style={styles.checkboxWrapper}>
            <Text
              fontSize={18}
              fontWeight={600}
              color={theme.color.violet[400]}
            >
              Programs
            </Text>
            <Checkbox
              label="CCCAP"
              direction="reverse"
              isChecked={!!_providerFilters?.cccap_authorization_status}
              onChange={(value) =>
                updateProviderFilter("cccap_authorization_status", value)
              }
            />
          </View>
          {JSON.stringify(providerFilters) !==
            JSON.stringify(_providerFilters) && (
            <Button
              direction="reverse"
              iconName="filter"
              onPress={() => {
                applyProviderFilters(_providerFilters);
                setIsOpen(false);
              }}
              title="Apply filters"
            />
          )}
        </View>
      )}
      <Button
        direction="reverse"
        iconName={isOpen ? "arrow-up" : "arrow-down"}
        onPress={() => setIsOpen((isOpen) => !isOpen)}
        title={isOpen ? "Close filters" : "Open filters"}
        variant="inverted"
      />
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.white,
    borderBottomLeftRadius: theme.spacing[11],
    borderBottomRightRadius: theme.spacing[11],
    marginBottom: theme.spacing[1],
  },
  checkboxesWrapper: {
    gap: theme.spacing[4],
    padding: theme.spacing[4],
    paddingBottom: 0,
  },
  checkboxWrapper: {
    gap: theme.spacing[1],
  },
  heartCheckbox: {
    flexDirection: "row-reverse",
    gap: theme.spacing[2],
    justifyContent: "space-between",
  },
  heartCheckboxLabel: {
    marginTop: 6,
  },
}));

export default ProviderFilters;
