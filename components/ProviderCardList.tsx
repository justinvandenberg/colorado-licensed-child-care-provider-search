import { ActivityIndicator, Text, View } from "react-native";

import { Provider } from "@/types/Provider";

import { useFetchData } from "@/hooks/useFetchData";

import { createStyleSheet } from "@/utilities/createStyleSheet";

import ProviderCard from "./ProviderCard";

const CHILDCARE_API_URL =
  "https://data.colorado.gov/api/v3/views/a9rr-k8mu/query.json";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-App-Token": "GsjFGurJWkx1p6Zbnti1TZlQj",
  },
  body: {
    query: "SELECT *",
    page: { pageNumber: 1, pageSize: 20 },
    includeSynthetic: false,
  },
};

const ProviderCardList = () => {
  const { data, loading, error } = useFetchData<Provider[]>(
    CHILDCARE_API_URL,
    options
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={[styles.root]}>
      <Text>Found {data?.length ?? 0} child care providers</Text>

      {data?.map((item) => (
        <View key={item.provider_id}>
          <ProviderCard {...item} />
        </View>
      ))}
    </View>
  );
};

const styles = createStyleSheet((theme) => ({
  root: {
    flex: 1,
    flexDirection: "column",
    gap: theme.spacing[2],
  },
}));

export default ProviderCardList;
