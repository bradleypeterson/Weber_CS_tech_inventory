import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { buildPath, useAccessibleRoutes } from "./useAccessibleRoutes";

export function useLinkTo() {
  const { routes } = useAccessibleRoutes();
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    (label: string, parentLabel?: string) => {
      const path = buildPath(label, parentLabel);
      if (routes.some((route) => route.type !== "menu" && route.path === path)) {
        if (location.pathname !== path) navigate(path);
      } else {
        console.error(`No path found for label: ${label}`);
      }
    },
    [routes, location, navigate]
  );
}
