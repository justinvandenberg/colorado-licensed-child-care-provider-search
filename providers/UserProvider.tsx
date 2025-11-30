import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { DbUser, User } from "@/types/User";

import { localDb } from "@/localDb";

interface UserContextType {
  error: Error | null;
  isFetching: boolean;
  isFetched: boolean;
  isLoading: boolean;
  updateCurrentUserFavorites: (providerId: string) => void;
  currentUserFavorites: User["favorites"];
  currentUser?: User;
}

const UserContext = createContext<UserContextType>({
  error: null,
  isFetched: false,
  isFetching: false,
  isLoading: false,
  updateCurrentUserFavorites: () => {},
  currentUserFavorites: [],
  currentUser: undefined,
});

const UserProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [currentUserFavorites, setCurrentUserFavorites] = useState<
    User["favorites"]
  >([]);

  const { data, error, isLoading, isFetching, isFetched } = useQuery({
    queryKey: ["fetchUser"],
    queryFn: fetchUser,
    enabled: currentUser === undefined,
  });

  /**
   * Update the current user's favorites in the local db
   * @param providerId {string} The id of the provider to be designated a favorite
   */
  const updateCurrentUserFavorites = useCallback(
    async (providerId: string) => {
      if (!currentUser) {
        return;
      }

      // Get the current list of favorites for the user
      let updatedFavorites = currentUserFavorites;

      // Check if the provider passed in exists in the current list of favorites
      if (updatedFavorites.includes(providerId)) {
        updatedFavorites = updatedFavorites.filter((f) => f !== providerId); // Remove
      } else {
        updatedFavorites = [...updatedFavorites, providerId]; // Add
      }

      // Update the row with the new list of favorites
      await localDb.runAsync(
        `
          UPDATE users
          SET favorites = ?
          WHERE id = ?
        `,
        JSON.stringify(updatedFavorites),
        currentUser.id
      );

      // Set the current user with the updated favorites
      setCurrentUser({ ...currentUser, favorites: updatedFavorites });
      setCurrentUserFavorites(updatedFavorites);
    },
    [currentUser, currentUserFavorites]
  );

  useEffect(() => {
    setCurrentUser(data);

    if (data?.favorites) {
      setCurrentUserFavorites(data.favorites);
    }
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        error,
        isLoading,
        isFetching,
        isFetched,
        updateCurrentUserFavorites,
        currentUserFavorites,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

/**
 * Get the first row from the user db table
 * A db will be created if it doesn't exist
 * @returns {Promise<User | undefined>}
 */
const fetchUser = async (): Promise<User | undefined> => {
  // If a db table for the user data doesn't exist, create it
  await localDb.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      favorites TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT
    );
    INSERT INTO users (favorites, created_at, updated_at) VALUES ('[]', (datetime('now')), (datetime('now')));
    CREATE TRIGGER IF NOT EXISTS users_updated_at_timestamp
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
      UPDATE users
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = NEW.id;
    END;
  `);

  // Get the first row from the user table
  const user: DbUser | null = await localDb.getFirstAsync(
    "SELECT * FROM users"
  );

  if (!user) {
    return;
  }

  // Parse stringified favorite and visits into a usable array
  const parsedUser = {
    ...user,
    favorites: JSON.parse(user.favorites),
  };

  return parsedUser;
};

export { fetchUser, UserProvider, useUser };
