import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "@/types/User";

import {
  fetchLocalDbUser,
  updateLocalDbUserFavorites,
} from "@/utilities/localDb";

interface UserContextType {
  error: Error | null;
  isFetching: boolean;
  isFetched: boolean;
  isLoading: boolean;
  updateUserFavorites: (id: string, user: User) => void;
  user?: User;
}

const UserContext = createContext<UserContextType>({
  error: null,
  isFetched: false,
  isFetching: false,
  isLoading: false,
  updateUserFavorites: () => {},
  user: undefined,
});

const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | undefined>();

  const { data, error, isLoading, isFetching, isFetched } = useQuery({
    queryKey: ["fetchLocalDbUser"],
    queryFn: fetchLocalDbUser,
    enabled: !user,
  });

  const updateUserFavorites = useCallback(async (id: string, user: User) => {
    const updatedUser = await updateLocalDbUserFavorites(id, user);
    setUser(updatedUser);
  }, []);

  useEffect(() => {
    setUser(data);
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        error,
        isLoading,
        isFetching,
        isFetched,
        updateUserFavorites,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useProviders must be used within a UserProvider");
  }

  return context;
};

export { UserProvider, useUser };
