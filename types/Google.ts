export interface GoogleGeoDataLocation {
  lat: number;
  lng: number;
}

export interface GoogleGeoData {
  geometry?: {
    location: GoogleGeoDataLocation;
  };
  place_id: string;
}

export interface GooglePlacesData {
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
}
