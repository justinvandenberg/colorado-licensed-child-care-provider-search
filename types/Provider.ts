export interface CdecProvider {
  provider_id: string;
  provider_name: string;
  provider_service_type: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  ecc: string;
  ccrr: string;
  school_district_operated_program: boolean;
  school_district: string;
  quality_rating: string;
  award_date: Date;
  expiration_date: Date;
  total_licensed_capacity: number;
  cccap_fa_status_d1: boolean;
  cccap_authorization_status: boolean;
  licensed_home_capacity: number;
  licensed_infant_capacity: number;
  licensed_toddler_capacity: number;
  licensed_preschool_capacity: number;
  licensed_school_age_capacity: number;
  licensed_preschool_and_school_age_capacity: number;
  licensed_resident_camp_capacity: number;
  governing_body: string;
}

type Period = {
  open: {
    date: Date;
    truncated: boolean;
    day: number;
    hour: number;
    minute: number;
  };
  close: {
    date: Date;
    truncated: boolean;
    day: number;
    hour: number;
    minute: number;
  };
};

/**
 * Google Maps API ref:
 * https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#openinghours
 */
export type OpeningHours = {
  periods: Period[];
  weekdayDescriptions: string[];
  secondaryHoursType: string;
  specialDays: string[];
  nextOpenTime: string;
  nextCloseTime: string;
  openNow: boolean;
};

export type Provider = CdecProvider & {
  location: {
    lat: number;
    lng: number;
  };
  place_id: string;
  formatted_address: string;
  website?: string;
  formatted_phone_number?: string;
  opening_hours?: OpeningHours;
  static_map_uri: string;
  updated_at: string;
};
