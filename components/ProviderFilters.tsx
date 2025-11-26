import Feather from "@expo/vector-icons/Feather";
import { FC, useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { Filters as FiltersType } from "@/types/Provider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import Button from "./ui/Button";
import Checkbox from "./ui/Checkbox";
import Text from "./ui/Text";

const ProviderFilters: FC = () => {
  const theme = useTheme();
  const { filters, applyFilters } = useProviders();

  const [pendingFilters, setPendingFilters] = useState<FiltersType>(filters);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**
   * Update the pending filters
   * @param key {keyof FiltersType} The key of the filter
   * @param value {boolean} The value of the filter
   */
  const updatePendingFilters = useCallback(
    (key: keyof FiltersType, value: boolean) => {
      setPendingFilters((providerFilters) => ({
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
              updatePendingFilters(
                "only_favorites",
                !pendingFilters?.["only_favorites"]
              )
            }
            style={styles.heartCheckbox}
          >
            {!!pendingFilters?.["only_favorites"] ? (
              <Feather
                color={theme.color.red[400]}
                name="heart" // TODO: Need a filled version
                size={24}
              />
            ) : (
              <Feather color={theme.color.red[400]} name="heart" size={24} />
            )}
            <Text fontWeight={500} style={styles.heartCheckboxLabel}>
              Only favorites?
            </Text>
          </TouchableOpacity>
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
              onChange={(value) =>
                updatePendingFilters("licensed_infant_capacity", value)
              }
            />
            <Checkbox
              direction="reverse"
              initialIsChecked={!!pendingFilters?.licensed_toddler_capacity}
              label="Toddler"
              onChange={(value) =>
                updatePendingFilters("licensed_toddler_capacity", value)
              }
            />
            <Checkbox
              direction="reverse"
              initialIsChecked={!!pendingFilters?.licensed_preschool_capacity}
              label="PreK"
              onChange={(value) =>
                updatePendingFilters("licensed_preschool_capacity", value)
              }
            />
            <Checkbox
              direction="reverse"
              initialIsChecked={!!pendingFilters?.licensed_school_age_capacity}
              label="K-12"
              onChange={(value) =>
                updatePendingFilters("licensed_school_age_capacity", value)
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
              onChange={(value) =>
                updatePendingFilters(
                  "provider_service_type.Child Care Center",
                  value
                )
              }
            />
            <Checkbox
              label="Preschool program"
              direction="reverse"
              initialIsChecked={
                !!pendingFilters?.["provider_service_type.Preschool Program"]
              }
              onChange={(value) =>
                updatePendingFilters(
                  "provider_service_type.Preschool Program",
                  value
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
              onChange={(value) =>
                updatePendingFilters(
                  "provider_service_type.School-Age Child Care Center",
                  value
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
              onChange={(value) =>
                updatePendingFilters(
                  "provider_service_type.Large Family Child Care Home",
                  value
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
              onChange={(value) =>
                updatePendingFilters(
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
              initialIsChecked={!!pendingFilters?.cccap_authorization_status}
              onChange={(value) =>
                updatePendingFilters("cccap_authorization_status", value)
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
