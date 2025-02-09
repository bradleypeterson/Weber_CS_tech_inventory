import { ArrowRight } from "@phosphor-icons/react";
import { useState } from "react";
import { IconButton } from "../../elements/IconButton/IconButton";
import { MenuItem } from "../../elements/NavbarElements/MenuItem";
import { SubMenuItem } from "../../elements/NavbarElements/SubMenuItem";
import { useAccessibleRoutes } from "../../navigation/useAccessibleRoutes";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { routes } = useAccessibleRoutes();
  const linkTo = useLinkTo();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <h1>SCAM</h1>
      <nav>
        {routes.map(
          (route, i) =>
            route.type === "menu" && (
              <MenuItem key={i} {...{ collapsed, icon: route.icon, title: route.label, setCollapsed }}>
                {route.items.map((item, j) => (
                  <SubMenuItem key={`${i}/${j}`} title={item.label} onClick={() => linkTo(item.label, route.label)} />
                ))}
              </MenuItem>
            )
        )}
      </nav>

      <div className={styles.collapseButton}>
        <IconButton
          onClick={() => setCollapsed((cur) => !cur)}
          icon={<ArrowRight style={{ transform: collapsed ? "" : "rotate(180deg)", transition: "0.2s ease-in-out" }} />}
        />
      </div>
    </aside>
  );
}
