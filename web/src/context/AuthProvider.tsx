import { ReactNode, useState } from "react";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<number[]>([]);
  const [token, setToken] = useState<string>("");

  return (
    <AuthContext.Provider value={{ permissions, setPermissions, token, setToken }}>{children}</AuthContext.Provider>
  );
}
