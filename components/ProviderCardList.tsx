import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { Provider } from "@/types/Provider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import Pagination from "./ui/Pagination";

import ProviderCard from "./ProviderCard";

const APP_TOKEN =
  process.env.CDEC_APP_TOKEN ?? process.env.EXPO_PUBLIC_CDEC_APP_TOKEN;
const API_URL = "https://data.colorado.gov/api/v3/views/a9rr-k8mu/query.json";
const PAGE_SIZE = 5;

const ProviderCardList = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  // const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>();

  const onPaginationNext = useCallback(() => {
    if (pageNumber === totalPages) {
      return;
    }
    setPageNumber((pageNumber) => pageNumber + 1);
  }, []);

  const onPaginationPrev = useCallback(() => {
    if (pageNumber === 1) {
      return;
    }
    setPageNumber((pageNumber) => pageNumber - 1);
  }, [pageNumber]);

  // Get the total number of entries in the DB
  useEffect(() => {
    // Only need this to run once, if the value is defined abort
    if (totalPages) {
      return;
    }

    const fetchTotalPages = async () => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Token": `${APP_TOKEN}`,
        },
        body: JSON.stringify({
          query: "SELECT COUNT(*)",
          includeSynthetic: false,
        }),
      });
      const json = await response.json();
      const totalProviders = parseInt(json[0].COUNT || 0);
      setTotalPages(Math.min(1, totalProviders / PAGE_SIZE));
    };

    fetchTotalPages();
  }, [totalPages]);

  // Update the providers every time the pageNumber changes
  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-App-Token": `${APP_TOKEN}`,
          },
          body: JSON.stringify({
            query: "SELECT *",
            page: { pageNumber, pageSize: PAGE_SIZE },
            includeSynthetic: false,
          }),
        });
        const json = await response.json();
        setProviders(json);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [pageNumber]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={[styles.root]}>
      <Text>Found {providers?.length ?? 0} child care providers</Text>
      {providers.length > 0 &&
        providers?.map((provider) => (
          <View key={provider.provider_id}>
            <ProviderCard {...provider} />
          </View>
        ))}
      <Pagination onNext={onPaginationNext} onPrev={onPaginationPrev} />
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    gap: theme.spacing[2],
  },
}));

// Get the total number of
const getPagesCount = async () => {
  const res = await fetch(
    "https://data.colorado.gov/api/v3/views/a9rr-k8mu/query.json?$select=count(*)"
  );
  const data = await res.json();
  return parseInt(data[0].count, 10);
};

export default ProviderCardList;
