/**
 * API fields:
 * https://dev.socrata.com/foundry/data.colorado.gov/a9rr-k8mu
 */
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

export type Provider = CdecProvider & {
  location: {
    lat: number;
    lng: number;
  };
  place_id: string;
  formatted_address: string;
  website?: string;
  formatted_phone_number?: string;
  static_map_uri: string;
  updated_at: string;
  is_favorite?: boolean;
};

export interface ProviderFilters {
  only_favorites: boolean;
  // Capacity
  licensed_infant_capacity: boolean;
  licensed_toddler_capacity: boolean;
  licensed_preschool_capacity: boolean;
  licensed_school_age_capacity: boolean;
  // Setting
  "provider_service_type.School-Age Child Care Center": boolean;
  "provider_service_type.Preschool Program": boolean;
  "provider_service_type.Large Family Child Care Home": boolean;
  "provider_service_type.Child Care Center": boolean;
  "provider_service_type.Neighborhood Youth Organization": boolean;
  // Programs
  cccap_authorization_status: boolean;
}
