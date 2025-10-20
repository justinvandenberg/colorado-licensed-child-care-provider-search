import { Provider } from "@/types/Provider";
import { Directory, File, Paths } from "expo-file-system";
import { Image } from "expo-image";
import { useCallback, useEffect, useMemo, useState } from "react";

const FILE_EXT = ".png";
const DIR_NAME = "mapbox";
const ACCESS_TOKEN =
  process.env.MAPBOX_ACCESS_TOKEN ??
  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

export interface UseMapboxResult {
  imageUri: string | null;
  loading: boolean;
  error: Error | null;
  clearImageCache: () => void;
}

// Use MapBox Geocode and Static Images APIs
const useMapbox = ({
  id,
  streetAddress,
  city,
  state,
}: {
  id: Provider["provider_id"];
  streetAddress: Provider["street_address"];
  city: Provider["city"];
  state: Provider["state"];
}): UseMapboxResult => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dir = useMemo(() => new Directory(Paths.cache, DIR_NAME), []);

  // Delete images from the cache directory and clear the disk cache
  // TODO: Add to Dev page
  const clearImageCache = useCallback(() => {
    if (dir.exists) {
      dir.delete();
    }
    Image.clearDiskCache();
  }, [dir]);

  useEffect(() => {
    const fetchStaticImages = async () => {
      setLoading(true);
      setError(null);
      const image = new File(dir, `${id}${FILE_EXT}`);
      const imageModDate = image.modificationTime || 0;
      const currentDate = new Date();
      const minModDate = currentDate.setMonth(currentDate.getMonth() - 1);

      // If the file exists and if the last modification was less than a month ago
      if (image.exists && imageModDate > minModDate) {
        setImageUri(image.uri);
      } else {
        // If the file doesn't exist request geocode data
        if (streetAddress && city && state) {
          const coordinates = await fetchGeocodeData(
            streetAddress,
            city,
            state
          );

          // If the directory doesn't exist, make it
          // Needed because `File.downloadFileAsync` will NOT create the directory
          if (!dir.exists) {
            dir.create();
          }

          // Download a file from the network (this will write the file locally as well)
          const downloadedImage = await downloadImage(id, coordinates);

          if (downloadedImage) {
            setImageUri(downloadedImage.uri);
          }
        }
      }
    };

    fetchStaticImages();
  });

  return { imageUri, loading, error, clearImageCache };
};

// Get the geocode data from the MapBox API
// Using the address, formatted as `{streetAddress},{city},{state}`
const fetchGeocodeData = async (
  streetAddress: string,
  city: string,
  state: string
): Promise<number[]> => {
  try {
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
      `${streetAddress},${city},${state}`
    )}&access_token=${ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.features[0].geometry.coordinates;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Download the image from MapBox and write irt to the local file system
const downloadImage = async (
  id: Provider["provider_id"],
  coordinates: number[] // MapBox coordinates are formatted [longitude, latitude]
): Promise<File | null> => {
  try {
    const coordinatesStr = coordinates.join(",");
    const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+514DF2(${coordinatesStr})/${coordinatesStr},15,0/400x300@2x?before_layer=poi-label&access_token=${ACCESS_TOKEN}`;
    const image = await File.downloadFileAsync(
      url,
      new File(Paths.cache, DIR_NAME, `${id}${FILE_EXT}`),
      { idempotent: true } // Overwrite existing image
    );
    return image as File;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { useMapbox };
