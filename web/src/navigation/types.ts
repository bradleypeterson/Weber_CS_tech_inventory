import { ReactNode } from "react";

export type RouteConfiguration = FeatureItem[];

export type FeatureItem = Menu | Dashboard | Page;

export interface FeatureConfigurationBase {
  type: "menu" | "page" | "dashboard";
  availability: () => boolean;
  label: string;
}

export interface Menu extends FeatureConfigurationBase {
  type: "menu";
  icon: ReactNode;
  menu: Dashboard[];
}

export interface Dashboard extends FeatureConfigurationBase {
  type: "dashboard";
  element: ReactNode;
}

export interface Page extends FeatureConfigurationBase {
  type: "page";
  label: string;
  element: ReactNode;
}

export interface BuiltFeatureItemBase {
  type: "menu" | "dashboard" | "page";
  key: string;
  label: string;
}

export interface BuiltMenu extends BuiltFeatureItemBase {
  type: "menu";
  icon: ReactNode;
  menu: BuiltDashboard[];
}

export interface BuiltDashboard extends BuiltFeatureItemBase {
  type: "dashboard";
  path: string;
  element: ReactNode;
}

export interface BuiltPage extends BuiltFeatureItemBase {
  type: "page";
  path: string;
  element: ReactNode;
}

export type BuiltFeatureItem = BuiltMenu | BuiltDashboard | BuiltPage;

export type BuiltFeatures = BuiltFeatureItem[];
