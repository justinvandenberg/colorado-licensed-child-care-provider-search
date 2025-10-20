export interface Provider {
  provider_id: string;
  provider_name: string;
  quality_rating: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  total_licensed_capacity: number;
  licensed_infant_capacity: number;
  licensed_toddler_capacity: number;
  licensed_preschool_and_school_age_capacity: number;
  licensed_school_age_capacity: number;
}
