import { useMemo } from "react";
import { BrowserRouter, useLocation } from "react-router";
import "./App.css";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Router } from "./navigation/Router";
import { BuiltDashboard, BuiltTab } from "./navigation/types";
import { useAccessibleRoutes } from "./navigation/useAccessibleRoutes";

function Layout() {
  const location = useLocation();
  const { routes } = useAccessibleRoutes();
  const dashboardRoutes = useMemo(
    () =>
      new Set(
        routes
          .filter((route): route is BuiltDashboard | BuiltTab => ["dashboard", "tab"].includes(route.type))
          .map((route) => route.path)
      ),
    [routes]
  );

  const showSidebar = useMemo(() => dashboardRoutes.has(location.pathname), [location, dashboardRoutes]);

  return (
    <div id="app-layout" className={!showSidebar ? "no-sidebar" : ""}>
      {showSidebar && <Sidebar />}
      <Router />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
