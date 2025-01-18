import { BrowserRouter as BR, Route, Routes } from "react-router";
import { useAccessibleRoutes } from "./useAccessibleRoutes";

export function Router() {
  const { routes } = useAccessibleRoutes();

  return (
    <BR>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BR>
  );
}
