import { Directory, File, Paths } from "expo-file-system";

import {
  GoogleGeoData,
  GoogleGeoDataLocation,
  GooglePlacesData,
} from "@/types/Google";

import { Provider } from "@/types/Provider";

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ??
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 * Fetch places data from Google's Places API using the TextQuery
 * Latitude and longitude are added to help with accuracy
 * @param name {string} The name of the provider
 * @param location {object} An object containing the latitude and longitude
 * @returns {Promise<GooglePlacesData>} An object containing the place data
 */
const fetchGooglePlacesData = async (
  name: Provider["provider_name"],
  location: Provider["location"]
): Promise<GooglePlacesData> => {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      // @ts-ignore
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask":
          "places.formattedAddress,places.nationalPhoneNumber,places.websiteUri",
      },
      body: JSON.stringify({
        textQuery: name,
        locationBias: {
          circle: {
            center: {
              latitude: location.lat,
              longitude: location.lng,
            },
            radius: 500, // In meters
          },
        },
      }),
    }
  );
  const json = await response.json();
  return json?.places?.[0];
};

/**
 * Fetch the geometry data from Google Geocode API
 * @param fullAddress {string} The concatenated address
 * @returns {Promise<GoogleGeoData>} An object containing the geometry data
 */
const fetchGoogleGeoData = async (
  fullAddress: string
): Promise<GoogleGeoData> => {
  const encodeFullAddress = encodeURIComponent(fullAddress);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeFullAddress}&key=${GOOGLE_MAPS_API_KEY}`
  );
  const json = await response.json();
  return json.results[0]; // First entry *should* be the most accurate
};

/**
 * Fetch the static map image from Google Static Map API and save it to local storage
 * @param dirName {string} The name of the directory for the downloaded images
 * @param fileName {string} The name of the downloaded file
 * @param location {object} An object containing the latitude and longitude
 * @returns {Promise<File>} The downloaded file
 */
const downloadGoogleStaticMapImage = async (
  dirName: string,
  fileName: string,
  location: GoogleGeoDataLocation
): Promise<File> => {
  const dir = new Directory(Paths.document, dirName);

  // If the db doesn't exist, create it
  if (!dir.exists) {
    dir.create();
  }

  const response = await File.downloadFileAsync(
    `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=400x300&scale=2&maptype=roadmap&map_id=b21976870ac0ee2c160fe8a5&markers=color:0x8B8B8B%7C${location.lat},${location.lng}&key=${GOOGLE_MAPS_API_KEY}`,
    new File(Paths.document, dirName, `${fileName}`),
    { idempotent: true } // Overwrite existing files
  );

  return response as File;
};

export {
  downloadGoogleStaticMapImage,
  fetchGoogleGeoData,
  fetchGooglePlacesData,
};
