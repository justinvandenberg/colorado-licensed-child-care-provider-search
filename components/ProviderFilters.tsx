import { FC, useCallback, useState } from "react";
import { View } from "react-native";

import { Filters as FiltersType } from "@/types/Provider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import Button from "./ui/Button";
import Checkbox from "./ui/Checkbox";
import Text from "./ui/Text";

const ProviderFilters: FC = () => {
  const theme = useTheme();
  const { filters, applyFilters, totalFilters } = useProviders();

  const [pendingFilters, setPendingFilters] = useState<FiltersType>(filters);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**
   * Update the pending filters on checkbox change
   * @param key {keyof FiltersType} The key of the filter
   * @param isChecked {boolean} Wether the checkbox is checked
   */
  const handleCheckboxChange = useCallback(
    (key: keyof FiltersType, isChecked: boolean) => {
      setPendingFilters((providerFilters) => ({
        ...providerFilters,
        [key]: isChecked,
      }));
    },
    []
  );

  return (
    <View style={styles.root}>
      {isOpen && (
        <View style={styles.checkboxesWrapper}>
          <View style={styles.checkboxWrapper}>
            <Text
              color={theme.color.violet[400]}
              fontSize={18}
              fontWeight={600}
            >
              Capacity
            </Text>
            <Checkbox
              direction="reverse"
              initialIsChecked={!!pendingFilters?.licensed_infant_capacity}
              label="Infant"
              onChange={(isChecked) =>
                handleCheckboxChange("licensed_infant_capacity", isChecked)
              }
            />
            <Checkbox
              direction="reverse"
              initialIsChecked={!!pendingFilters?.licensed_toddler_capacity}
              label="Toddler"
              onChange={(isChecked) =>
                handleCheckboxChange("licensed_toddler_capacity", isChecked)
              }
            />
            <Checkbox
              direction="reverse"
              initialIsChecked={!!pendingFilters?.licensed_preschool_capacity}
              label="PreK"
              onChange={(isChecked) =>
                handleCheckboxChange("licensed_preschool_capacity", isChecked)
              }
            />
            <Checkbox
              direction="reverse"
              initialIsChecked={!!pendingFilters?.licensed_school_age_capacity}
              label="K-12"
              onChange={(isChecked) =>
                handleCheckboxChange("licensed_school_age_capacity", isChecked)
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
              initialIsChecked={
                !!pendingFilters?.["provider_service_type.Child Care Center"]
              }
              onChange={(isChecked) =>
                handleCheckboxChange(
                  "provider_service_type.Child Care Center",
                  isChecked
                )
              }
            />
            <Checkbox
              label="Preschool program"
              direction="reverse"
              initialIsChecked={
                !!pendingFilters?.["provider_service_type.Preschool Program"]
              }
              onChange={(isChecked) =>
                handleCheckboxChange(
                  "provider_service_type.Preschool Program",
                  isChecked
                )
              }
            />
            <Checkbox
              label="School age program"
              direction="reverse"
              initialIsChecked={
                !!pendingFilters?.[
                  "provider_service_type.School-Age Child Care Center"
                ]
              }
              onChange={(isChecked) =>
                handleCheckboxChange(
                  "provider_service_type.School-Age Child Care Center",
                  isChecked
                )
              }
            />
            <Checkbox
              label="Family child care"
              direction="reverse"
              initialIsChecked={
                !!pendingFilters?.[
                  "provider_service_type.Large Family Child Care Home"
                ]
              }
              onChange={(isChecked) =>
                handleCheckboxChange(
                  "provider_service_type.Large Family Child Care Home",
                  isChecked
                )
              }
            />
            <Checkbox
              label="Neighborhood youth organization"
              direction="reverse"
              initialIsChecked={
                !!pendingFilters?.[
                  "provider_service_type.Neighborhood Youth Organization"
                ]
              }
              onChange={(isChecked) =>
                handleCheckboxChange(
                  "provider_service_type.Neighborhood Youth Organization",
                  isChecked
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
              initialIsChecked={!!pendingFilters?.cccap_authorization_status}
              onChange={(isChecked) =>
                handleCheckboxChange("cccap_authorization_status", isChecked)
              }
            />
          </View>
          {JSON.stringify(filters) !== JSON.stringify(pendingFilters) && (
            <Button
              direction="reverse"
              iconName="filter"
              onPress={() => {
                applyFilters(pendingFilters);
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
        title={
          isOpen
            ? `Close filters${totalFilters > 0 ? ` (${totalFilters})` : ""}`
            : `Open filters${totalFilters > 0 ? ` (${totalFilters})` : ""}`
        }
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
