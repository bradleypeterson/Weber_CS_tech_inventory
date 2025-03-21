import { createContext } from "react";

export type AuthContextType = {
  permissions: number[];
  token: string;
  setPermissions: (permissions: number[]) => void;
  setToken: (token: string) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
