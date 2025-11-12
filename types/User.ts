export interface Visit {
  id: string;
  title: string;
  healthAndSafety?: {
    0: boolean;
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
    5: boolean;
    6: boolean;
  };
  dailyActivities?: {
    0: boolean;
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
  };
  providerInteractions?: {
    0: boolean;
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
  };
  learningEnvironment?: {
    0: boolean;
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
  };
  personalRating?: number;
  notes?: string;
}

export interface User {
  id: number;
  favorites: string[];
  visits: Visit[];
}

export type LocalDbUser = User & {
  favorites: string;
  visits: string;
};
