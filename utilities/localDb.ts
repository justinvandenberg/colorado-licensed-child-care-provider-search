import * as SQLite from "expo-sqlite";

import { LocalDbUser, User } from "@/types/User";

export const localDb = SQLite.openDatabaseSync("user.db");

/**
 * Get the first row from the user db table
 * A db will be created if it doesn't exist
 * @returns {Promise<User | undefined>}
 */
const fetchLocalDbUser = async (): Promise<User | undefined> => {
  // If a db table for the user data doesn't exist, create it
  await localDb.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY NOT NULL, favorites TEXT);
    INSERT OR IGNORE INTO user (id, favorites) VALUES (0, "[]");
  `);
  // Get the first row from the user db table
  const user: LocalDbUser | null = await localDb.getFirstAsync(
    "SELECT * FROM user"
  );

  if (!user) {
    return;
  }

  /**
   * Parse stringified favorites into a usable array
   * Must ensure the the ids are strings or they won't be typed correctly
   */
  user.favorites = JSON.parse(user.favorites);
  return user;
};

/**
 * Update the list of favorites in the user db
 * @param id {number} The provider id
 * @param user {User} The current user
 * @returns {Promise<User>}
 */
const updateLocalDbUserFavorites = async (
  id: string,
  user: User
): Promise<User> => {
  // Get the current list of favorites for the user
  const { favorites } = user;
  let updatedFavorites = favorites;

  // Check if the provider passed in exists in the current list of favorites
  if (favorites.includes(id)) {
    updatedFavorites = favorites.filter((i) => i !== id); // Remove
  } else {
    updatedFavorites = [...favorites, id]; // Add
  }

  // Update the row with the new list of favorites
  await localDb.runAsync(
    "UPDATE user SET favorites = ? WHERE id = ?",
    JSON.stringify(updatedFavorites),
    user.id
  );

  return { ...user, favorites: updatedFavorites };
};

const dropLocalDbUserTable = async () => {
  return await localDb.execAsync(`
    DROP TABLE IF EXISTS user;
  `);
};

export { dropLocalDbUserTable, fetchLocalDbUser, updateLocalDbUserFavorites };
