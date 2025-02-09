import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAccessibleRoutes } from "./useAccessibleRoutes";

export function useLinkTo() {
  const { flattenedRoutes } = useAccessibleRoutes();
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    (label: string, parentMenuLabel?: string) => {
      const safeLabel = label.replaceAll(" ", "-").toLowerCase();
      const safeParentMenuLabel = parentMenuLabel?.replaceAll(" ", "-").toLowerCase();
      let key = `${safeLabel}`;
      if (safeParentMenuLabel) key = `${safeParentMenuLabel}/${safeLabel}`;

      const path = flattenedRoutes.find((route) => route.key === key)?.path;
      if (path) {
        if (location.pathname !== path) navigate(path);
      } else {
        console.error(`No path found for label: ${safeLabel}`);
        navigate("/404");
      }
    },
    [navigate, flattenedRoutes, location.pathname]
  );
}
