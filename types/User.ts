export interface User {
  id: number;
  favorites: string[];
  updated_at: string;
  created_at: string;
}

export type DbUser = Omit<User, "favorites"> & {
  favorites: string;
};
