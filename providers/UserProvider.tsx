import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { User, Visit } from "@/types/User";

import {
  fetchLocalDbUser,
  updateLocalDbUserFavorites,
} from "@/utilities/localDb";

interface UserContextType {
  currentVisit: Visit | null;
  error: Error | null;
  isFetching: boolean;
  isFetched: boolean;
  isLoading: boolean;
  setCurrentVisit: (visit: Visit | null) => void;
  updateUserFavorites: (id: string, user: User) => void;
  currentUser?: User;
}

const UserContext = createContext<UserContextType>({
  currentVisit: null,
  error: null,
  isFetched: false,
  isFetching: false,
  isLoading: false,
  setCurrentVisit: () => {},
  updateUserFavorites: () => {},
  currentUser: undefined,
});

const UserProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(null);

  const { data, error, isLoading, isFetching, isFetched } = useQuery({
    queryKey: ["fetchLocalDbUser"],
    queryFn: fetchLocalDbUser,
    enabled: !currentUser,
  });

  const updateUserFavorites = useCallback(async (id: string, user: User) => {
    const updatedUser = await updateLocalDbUserFavorites(id, user);
    setCurrentUser(updatedUser);
  }, []);

  useEffect(() => {
    setCurrentUser(data);
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        currentVisit,
        error,
        isLoading,
        isFetching,
        isFetched,
        setCurrentVisit,
        updateUserFavorites,
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
