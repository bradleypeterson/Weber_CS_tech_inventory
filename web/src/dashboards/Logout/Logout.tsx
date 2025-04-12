import { useEffect } from "react";
import { useLinkTo } from "../../navigation/useLinkTo";

export function Logout() {
  const linkTo = useLinkTo();
  useEffect(() => {
    localStorage.removeItem("token");
    linkTo("login");
  }, [linkTo]);

  return <></>;
}
