import { useMemo } from "react";
import { configuration } from "./Configuration";
import { BuiltDashboard, BuiltFeatures, BuiltPage, BuiltTab, Menu, Page, RouteConfiguration } from "./types";

export function useAccessibleRoutes() {
  const routes = useMemo(() => buildAccessibleRoutes(configuration), []);

  return { routes };
}

function buildAccessibleRoutes(configuration: RouteConfiguration): BuiltFeatures {
  const builtFeatures: BuiltFeatures = [];
  for (const featureItem of configuration) {
    if (featureItem.type === "menu") builtFeatures.push(...buildMenuFeature(featureItem));
    if (featureItem.type === "page") builtFeatures.push(...buildPageFeature(featureItem));
  }

  return builtFeatures;
}

function buildMenuFeature(menu: Menu) {
  if (!menu.availability() || !menu.menu.some((dashboard) => dashboard.availability())) return [];

  const items: BuiltFeatures = [];
  const dashboards: BuiltDashboard[] = [];
  const tabs: BuiltTab[] = [];

  for (const dashboard of menu.menu) {
    if (!dashboard.availability()) continue;
    const builtDashboard: BuiltDashboard = {
      type: "dashboard",
      label: dashboard.label,
      path: buildPath(dashboard.label, [menu.label]),
      key: buildKey(dashboard.label, [menu.label]),
      element: dashboard.element,
      filters: dashboard.filters
    };

    for (const tab of dashboard.tabs ?? []) {
      const builtTab: BuiltTab = {
        type: "tab",
        label: tab.label,
        path: buildPath(tab.label, [menu.label, dashboard.label]),
        key: buildKey(tab.label, [menu.label, dashboard.label]),
        element: tab.element,
        filters: tab.filters
      };
      items.push(builtTab);
      tabs.push(builtTab);
    }

    items.push(builtDashboard);
    dashboards.push(builtDashboard);
  }

  items.push({
    type: "menu",
    label: menu.label,
    icon: menu.icon,
    key: buildKey(menu.label),
    menu: dashboards
  });

  return items;
}

function buildPageFeature(page: Page): BuiltPage[] {
  if (!page.availability()) return [];
  return [
    {
      type: "page",
      path: buildPath(page.label),
      key: buildKey(page.label),
      label: page.label,
      element: page.element
    }
  ];
}

function buildKey(label: string, parentLabels?: string[]) {
  const safeLabel = label.replaceAll(" ", "-").toLowerCase();
  const safeParentLabel = parentLabels?.map((label) => label.replaceAll(" ", "-").toLowerCase());
  return safeParentLabel ? `${safeParentLabel.join("/")}/${safeLabel}` : safeLabel;
}

export function buildPath(label: string, parentLabels?: string[]) {
  const key = buildKey(label, parentLabels);
  return `/${key}`;
}
