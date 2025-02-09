import { Route, Routes } from "react-router";
import { useAccessibleRoutes } from "./useAccessibleRoutes";

export function Router() {
  const { flattenedRoutes } = useAccessibleRoutes();
  console.log(flattenedRoutes);
  return (
    <Routes>
      {flattenedRoutes.map((route) => (
        <Route key={route.key} path={route.path} element={route.element} />
      ))}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}
