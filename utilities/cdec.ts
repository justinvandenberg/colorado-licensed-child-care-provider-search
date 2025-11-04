import { CdecProvider, Provider } from "@/types/Provider";

const CDEC_API_URL =
  "https://data.colorado.gov/api/v3/views/a9rr-k8mu/query.json";
const CDEC_APP_TOKEN =
  process.env.CDEC_APP_TOKEN ?? process.env.EXPO_PUBLIC_CDEC_APP_TOKEN;

/**
 * This is used in dev to limit request sizes,
 * but should be set above the max number of providers
 * https://data.colorado.gov/Early-childhood/Colorado-Licensed-Child-Care-Facilities-Report/a9rr-k8mu/data_preview
 */
const PAGE_SIZE = 20;

/**
 * Fetch the providers from the CDEC API
 * pageSize can be used as a max
 * @param query {string} An SQL query as a string
 * @param pageSize {number} The max number of providers to fetch
 * @returns {Promise<CdecProvider[]>} A CdecProvider
 */
const fetchCdecProviders = async (
  query = "SELECT *",
  pageSize: number = PAGE_SIZE
): Promise<CdecProvider[]> => {
  const response = await fetch(CDEC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Token": `${CDEC_APP_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      page: { pageNumber: 1, pageSize },
      includeSynthetic: false,
    }),
  });
  const json = await response.json();
  return json;
};

/**
 * Transform a provider object to a CDEC provider object
 * @param provider {Provider} The provider to transform
 * @returns {CdecProvider}
 */
const transformProviderToCdecProvider = (
  provider: Partial<Provider>
): CdecProvider => {
  const keysToRemove: (keyof Provider)[] = [
    "location",
    "place_id",
    "formatted_address",
    "website",
    "formatted_phone_number",
    "static_map_uri",
  ];
  return Object.fromEntries(
    Object.entries(provider as Provider).filter(
      ([key]) => !keysToRemove.includes(key as keyof CdecProvider)
    )
  ) as CdecProvider;
};

export { fetchCdecProviders, transformProviderToCdecProvider };
