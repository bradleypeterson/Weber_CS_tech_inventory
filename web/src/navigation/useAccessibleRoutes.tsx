import { ReactNode, useEffect, useState } from "react";

type RouteConfig = {
  path: string;
  element: ReactNode;
  accessible: () => boolean;
};

export const routeConfig: RouteConfig[] = [
  {
    path: "/",
    element: <h1>Home</h1>,
    accessible: () => true
  },
  {
    path: "/search",
    element: <h1>Search</h1>,
    accessible: () => true
  },
  {
    path: "/asset",
    element: <h1>Asset</h1>,
    accessible: () => true
  }
];

export function useAccessibleRoutes() {
  const [routes, setRoutes] = useState<RouteConfig[]>([]);

  useEffect(function filterRouteConfig() {
    const accessibleRoutes = routeConfig.filter((route) => route.accessible());
    setRoutes(accessibleRoutes);
  }, []);

  return { routes };
}
