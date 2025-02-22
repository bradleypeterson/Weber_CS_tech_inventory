import { BookOpen, Briefcase, Package, UserGear } from "@phosphor-icons/react";
import { AssetsAddDashboard } from "../dashboards/AssetsAddDashboard/AssetsAddDashboard";
import { AssetsDetailsDashboard } from "../dashboards/AssetsDetailsDashboard/AssetsDetailsDashboard";
import { AssetsSearchDashboard } from "../dashboards/AssetsSearchDashboard/AssetsSearchDashboard";
import { AuditDetailsDashboard } from "../dashboards/AuditDetailsDashboard/AuditDetailsDashboard";
import { AuditHistoryDashboard } from "../dashboards/AuditHistoryDashboard/AuditHistoryDashboard";
import { ContactDetailsDashboard } from "../dashboards/ContactDetailsDashboard/ContactDetailsDashboard";
import { ContactSearchDashboard } from "../dashboards/ContactSearchDashboard/ContactSearchDashboard";
import { EditListDashboard } from "../dashboards/EditListDashboard/EditListDashboard";
import { Elements } from "../dashboards/Elements";
import { LandingPage } from "../dashboards/LandingPage/LandingPage";
import { Login } from "../dashboards/Login/Login";
import { PasswordChangeDashboard } from "../dashboards/PasswordChangeDashboard/PasswordChangeDashboard";
import { UserDetailsDashboard } from "../dashboards/UserDetailsDashboard/UserDetailsDashboard";
import { UserSearchDashboard } from "../dashboards/UserSearchDashboard/UserSearchDashboard";
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
      { type: "dashboard", availability: () => true, label: "Asset Details", element: <AssetsDetailsDashboard /> },
      { type: "dashboard", availability: () => true, label: "Add", element: <AssetsAddDashboard /> }
    ],
    availability: () => true
  },
  {
    type: "menu",
    label: "Audits",
    icon: <Briefcase />,
    menu: [
      {
        type: "dashboard",
        availability: () => true,
        label: "History",
        element: <AuditHistoryDashboard />,
        tabs: [{ type: "tab", label: "Details", element: <AuditDetailsDashboard /> }]
      }
    ],
    availability: () => true
  },
  {
    type: "menu",
    label: "Admin",
    icon: <UserGear />,
    menu: [
      { type: "dashboard", 
        availability: () => true, 
        label: "Users", 
        element: <UserSearchDashboard />,   
        tabs: [
          { type: "tab", label: "Details", element: <UserDetailsDashboard /> },
          { type: "tab", label: "Change Password", element: <PasswordChangeDashboard/> }
        ]
      },
      { type: "dashboard", 
        availability: () => true, 
        label: "Contacts", 
        element: <ContactSearchDashboard />, 
        tabs: [{ type: "tab", label: "Details", element: <ContactDetailsDashboard /> }]
      },
      { type: "dashboard", availability: () => true, label: "List Options", element: <EditListDashboard /> }
    ],
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
    element: <Login />,
    availability: () => true
  },
  {
    type: "page",
    label: "Landingpage",
    element: <LandingPage />,
    availability: () => true
  },
];
