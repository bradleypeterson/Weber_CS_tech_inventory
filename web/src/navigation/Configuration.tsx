import { BookOpen, Briefcase, Package } from "@phosphor-icons/react";
import { AssetsSearchDashboard } from "../dashboards/AssetsSearchDashboard";
import { Elements } from "../dashboards/Elements";
import { RouteConfiguration } from "./types";

/* 
  Menus are in the sidebar - they have dashboards as children.
  Pages are "outside" the typical flow of the navigation. No sidebar is shown on a page. Think Login / Logout.
*/
export const configuration: RouteConfiguration = [
  {
    type: "menu",
    label: "Assets",
    icon: <Package />,
    menu: [
      { type: "dashboard", availability: () => true, label: "Search", element: <AssetsSearchDashboard /> },
      { type: "dashboard", availability: () => true, label: "Asset Details", element: <>Details</> },
      { type: "dashboard", availability: () => true, label: "Add", element: <>Add</> }
    ],
    availability: () => true
  },
  {
    type: "menu",
    label: "Audits",
    icon: <Briefcase />,
    menu: [{ type: "dashboard", availability: () => true, label: "Audit History", element: <>Audit History</> }],
    availability: () => true
  },
  {
    type: "menu",
    label: "Elements",
    icon: <BookOpen />,
    menu: [{ type: "dashboard", availability: () => true, label: "Elements", element: <Elements /> }],
    availability: () => true
  },
  {
    type: "page",
    label: "Login",
    element: <>Login</>,
    availability: () => true
  }
];
