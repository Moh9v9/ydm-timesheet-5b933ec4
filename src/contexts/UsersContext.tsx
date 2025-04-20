
import { createContext, useContext, ReactNode } from "react";
import { UsersContextType } from "@/features/users/types";
import { useUsersState } from "@/features/users/hooks/useUsersState";
import { useUsersOperations } from "@/features/users/hooks/useUsersOperations";

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const { users, setUsers, loading, setLoading } = useUsersState();
  const operations = useUsersOperations(users, setUsers, setLoading);

  const value = {
    users,
    loading,
    ...operations
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};
