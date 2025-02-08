import { ArrowRight, Briefcase, Package } from "@phosphor-icons/react";
import { IconButton } from "../../elements/IconButton/IconButton";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <h1>SCAM</h1>
      <nav></nav>
      <IconButton variant="secondary" icon={<ArrowRight />} />
      <IconButton variant="secondary" icon={<Package />} />
      <IconButton variant="secondary" icon={<Briefcase />} />
    </aside>
  );
}
