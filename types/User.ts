export interface User {
  id: number;
  favorites: string[];
}

export type LocalDbUser = User & {
  favorites: string;
};
