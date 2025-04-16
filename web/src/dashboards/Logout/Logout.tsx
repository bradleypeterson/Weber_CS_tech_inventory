import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLinkTo } from "../../navigation/useLinkTo";

export function Logout() {
  const linkTo = useLinkTo();
  const auth = useAuth();
  useEffect(() => {
    auth.logout();
    linkTo("login");
  }, [linkTo, auth]);

  return <></>;
}
