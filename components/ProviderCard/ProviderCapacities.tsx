import { FC } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { Provider } from "@/types/Provider";

import ProviderCapacity from "./ProviderCapacity";

type ProviderCapacitiesProps = {
  infantCapacity: Provider["licensed_infant_capacity"];
  preschoolCapacity: Provider["licensed_school_age_capacity"];
  schoolAgeCapacity: Provider["licensed_preschool_and_school_age_capacity"];
  toddlerCapacity: Provider["licensed_toddler_capacity"];
};

const ProviderCapacities: FC<ProviderCapacitiesProps> = ({
  infantCapacity = 0,
  preschoolCapacity = 0,
  schoolAgeCapacity = 0,
  toddlerCapacity = 0,
}) => {
  return (
    <View style={styles.root}>
      <ProviderCapacity title="Infant" count={infantCapacity} />
      <ProviderCapacity title="Toddler" count={toddlerCapacity} />
      <ProviderCapacity title="PreK" count={preschoolCapacity} />
      <ProviderCapacity title="K-12" count={schoolAgeCapacity} />
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[100],
    borderRadius: theme.spacing[8],
    flexDirection: "row",
    gap: theme.spacing[1],
    padding: theme.spacing[2],
  },
}));

export default ProviderCapacities;
