export interface Provider {
  provider_id: string;
  provider_name: string;
  city: string;
  quality_rating?: string;
  location?: { latitude: number; longitude: number };
  total_licensed_capacity?: number;
  licensed_infant_capacity?: number;
  licensed_toddler_capacity?: number;
  licensed_preschool_and_school_age_capacity?: number;
  licensed_school_age_capacity?: number;

  // Add other fields you want to type
}
