import { ReactNode, useEffect, useMemo, useState } from "react";
import { RouteConfig, routeConfig } from "./Configuration";

export function useAccessibleRoutes() {
  const [routes, setRoutes] = useState<RouteConfig[]>([]);

  useEffect(function filterRouteConfig() {
    const accessibleRoutes = routeConfig.filter((route) => route.accessible());
    setRoutes(accessibleRoutes);
  }, []);

  const flattenedRoutes = useMemo(() => flattenRoutes(routes), [routes]);

  return { routes, flattenedRoutes };
}

type Route = {
  key: string;
  path: string;
  element: ReactNode;
};

function flattenRoutes(routeConfig: RouteConfig[]) {
  const routes: Route[] = [];

  for (const config of routeConfig) {
    const safeConfigLabel = config.label.replaceAll(" ", "-").toLowerCase();
    if (config.type === "menu") {
      for (const item of config.items) {
        const safeItemLabel = item.label.replaceAll(" ", "-").toLowerCase();
        routes.push({
          key: `${safeConfigLabel}/${safeItemLabel}`,
          path: `/${safeConfigLabel}/${safeItemLabel}`,
          element: item.dashboard
        });
      }
    }

    if (config.type === "page") {
      routes.push({
        key: safeConfigLabel,
        path: `/${safeConfigLabel}`,
        element: config.element
      });
    }
  }

  return routes;
}
