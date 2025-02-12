import { useMemo } from "react";
import { configuration } from "./Configuration";
import { BuiltDashboard, BuiltFeatures, BuiltPage, Menu, Page, RouteConfiguration } from "./types";

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
  for (const dashboard of menu.menu) {
    if (!dashboard.availability()) continue;
    const builtDashboard: BuiltDashboard = {
      type: "dashboard",
      label: dashboard.label,
      path: buildPath(dashboard.label, menu.label),
      key: buildKey(dashboard.label, menu.label),
      element: dashboard.element
    };

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

function buildKey(label: string, parentLabel?: string) {
  const safeLabel = label.replaceAll(" ", "-").toLowerCase();
  const safeParentLabel = parentLabel?.replaceAll(" ", "-").toLowerCase();
  return safeParentLabel ? `${safeParentLabel}/${safeLabel}` : safeLabel;
}

export function buildPath(label: string, parentLabel?: string) {
  const key = buildKey(label, parentLabel);
  return `/${key}`;
}
