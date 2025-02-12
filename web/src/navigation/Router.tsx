import { Route, Routes } from "react-router";
import { useAccessibleRoutes } from "./useAccessibleRoutes";

export function Router() {
  const { routes } = useAccessibleRoutes();
  return (
    <Routes>
      {routes.map(
        (route) => route.type !== "menu" && <Route key={route.key} path={route.path} element={route.element} />
      )}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}
