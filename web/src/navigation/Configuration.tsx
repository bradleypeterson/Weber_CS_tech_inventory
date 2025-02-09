import { Package } from "@phosphor-icons/react";
import { ReactNode } from "react";

interface RouteProperties {
  type: "dashboard" | "menu" | "page";
  accessible: () => boolean;
}

export interface Dashboard extends RouteProperties {
  type: "dashboard";
  label: string;
  dashboard: ReactNode;
}

export interface Menu extends RouteProperties {
  type: "menu";
  label: string;
  icon: ReactNode;
  items: Dashboard[];
}

export interface Page extends RouteProperties {
  type: "page";
  route: string;
  label: string;
  element: ReactNode;
}

export type RouteConfig = Menu | Page;

export const routeConfig: RouteConfig[] = [
  {
    type: "menu",
    label: "Assets",
    icon: <Package />,
    items: [
      {
        type: "dashboard",
        label: "Search",
        dashboard: <>Search</>,
        accessible: () => true
      }
    ],
    accessible: () => true
  }
];
