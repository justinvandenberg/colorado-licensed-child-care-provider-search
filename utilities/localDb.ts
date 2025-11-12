import * as SQLite from "expo-sqlite";

import { LocalDbUser, User, Visit } from "@/types/User";

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
    CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY NOT NULL, favorites TEXT, visits TEXT);
    INSERT OR IGNORE INTO user (id, favorites, visits) VALUES (0, "[]", "[]");
  `);

  // Get the first row from the user db table
  const user: LocalDbUser | null = await localDb.getFirstAsync(
    "SELECT * FROM user"
  );

  if (!user) {
    return;
  }

  // Parse stringified favorite and visits into a usable array
  user.favorites = JSON.parse(user.favorites);
  user.visits = JSON.parse(user.visits);

  return user;
};

/**
 * Update the list of favorites in the user db
 * @param id {string} The provider id for the favorite that is being toggled
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
    updatedFavorites = favorites.filter((f) => f !== id); // Remove
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

/**
 *
 *
 * @param id {string} The visit that is being added
 * @param user {User} The current user
 * @returns {Promise<User>}
 */
const addLocalDbVisit = async (visit: Visit, user: User): Promise<User> => {
  // Get the visits for the user
  const { visits } = user;
  const updatedVisits = [...visits, visit];

  // Update the row with the updated visits
  await localDb.runAsync(
    "UPDATE user SET visits = ? WHERE id = ?",
    JSON.stringify(updatedVisits),
    user.id
  );

  console.log({ ...user, visits: updatedVisits });

  return { ...user, visits: updatedVisits };
};

/**
 *
 *
 * @param id {string} The visit that is being added
 * @param user {User} The current user
 * @returns {Promise<User>}
 */
const deleteLocalDbVisit = async (
  id: Visit["id"],
  user: User
): Promise<User> => {
  // Get the visits for the user
  const { visits } = user;
  const updatedVisits = visits.filter((v) => v.id === id);

  // Update the row with the updated visits
  await localDb.runAsync(
    "UPDATE user SET visits = ? WHERE id = ?",
    JSON.stringify(updatedVisits),
    user.id
  );

  console.log({ ...user, visits: updatedVisits });
  return { ...user, visits: updatedVisits };
};

/**
 *
 *
 * @param id {string} The visit that is being updated
 * @param user {User} The current user
 * @returns {Promise<User>}
 */
const updateLocalDbVisit = async (visit: Visit, user: User): Promise<User> => {
  // Get the current visits for the user
  const { visits } = user;
  let updatedVisits = visits;

  // Check if the id from the visit passed in exists in the current visits
  const index = visits.findIndex((v) => (v.id = visit.id));
  if (index !== -1) {
    updatedVisits[index] = { ...updatedVisits[index], ...visit }; // Update
  } else {
    updatedVisits = [...visits, visit]; // Add
  }

  // Update the row with the updated visits
  await localDb.runAsync(
    "UPDATE user SET visits = ? WHERE id = ?",
    JSON.stringify(updatedVisits),
    user.id
  );

  return { ...user, visits: updatedVisits };
};

/**
 * Drop the user table from the local db
 * @returns
 */
const dropLocalDbUserTable = async () => {
  return await localDb.execAsync(`
    DROP TABLE IF EXISTS user;
  `);
};

export {
  addLocalDbVisit,
  deleteLocalDbVisit,
  dropLocalDbUserTable,
  fetchLocalDbUser,
  updateLocalDbUserFavorites,
  updateLocalDbVisit,
};
