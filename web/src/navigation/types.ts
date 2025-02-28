import { ReactNode } from "react";

export type RouteConfiguration = FeatureItem[];

export type FeatureItem = Menu | Dashboard | Page;

export interface FeatureConfigurationBase {
  type: "menu" | "page";
  availability: () => boolean;
  label: string;
}

export interface Menu extends FeatureConfigurationBase {
  type: "menu";
  icon: ReactNode;
  menu: Dashboard[];
}

export interface Dashboard {
  type: "dashboard";
  availability: () => boolean;
  label: string;
  element: ReactNode;
  tabs?: Tab[];
  filters?: string[];
}

export interface Page extends FeatureConfigurationBase {
  type: "page";
  label: string;
  element: ReactNode;
}

export interface Tab {
  type: "tab";
  label: string;
  element: ReactNode;
  filters?: string[];
}
export interface BuiltFeatureItemBase {
  type: "menu" | "dashboard" | "page" | "tab";
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
  filters?: string[];
}

export interface BuiltPage extends BuiltFeatureItemBase {
  type: "page";
  path: string;
  element: ReactNode;
}

export interface BuiltTab extends BuiltFeatureItemBase {
  type: "tab";
  path: string;
  element: ReactNode;
  filters?: string[];
}

export type BuiltFeatureItem = BuiltMenu | BuiltDashboard | BuiltPage | BuiltTab;

export type BuiltFeatures = BuiltFeatureItem[];
