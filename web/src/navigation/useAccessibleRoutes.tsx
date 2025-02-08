import { ArrowRight } from "@phosphor-icons/react";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../elements/Button/Button";

type RouteConfig = {
  path: string;
  element: ReactNode;
  accessible: () => boolean;
};

const arr = new Array(40).fill(Math.random());

export const routeConfig: RouteConfig[] = [
  {
    path: "/",
    element: (
      <div style={{ padding: "1rem" }}>
        <Button variant="secondary">Apply</Button>
        <Button variant="secondary" icon={<ArrowRight />}>
          Apply
        </Button>
        <Button variant="secondary">Apply asdfjahsdfjasdhfjasdfhajsdfh</Button>
        {arr.map((value, i) => (
          <div key={i}>{value}</div>
        ))}
      </div>
    ),
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
