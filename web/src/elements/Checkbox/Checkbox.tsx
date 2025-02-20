import { useMemo } from "react";
import styles from "./Checkbox.module.css";

type Props = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

export function Checkbox(props: Props) {
  const { checked, onChange, label, ...rest } = props;

  const classNames = useMemo(() => {
    const classNames = [styles.checkbox];
    return classNames;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          className={classNames.join(" ")}
          checked={checked}
          onChange={handleChange}
          {...rest}
        />
        {label && <span className={styles.label}>{label}</span>}
      </label>
    </div>
  );
}