import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<number[]>([]);
  const [token, setToken] = useState<string>("");
  const [personID, setPersonID] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const permissions = JSON.parse(localStorage.getItem("permissions") ?? "[]");
    const personID = Number(localStorage.getItem("personID"));
    setToken(token ?? "");
    setPermissions(permissions ?? []);
    setPersonID(personID ?? 0);
  }, []);

  return (
    <AuthContext.Provider value={{ permissions, setPermissions, token, setToken, personID, setPersonID }}>{children}</AuthContext.Provider>
  );
}
