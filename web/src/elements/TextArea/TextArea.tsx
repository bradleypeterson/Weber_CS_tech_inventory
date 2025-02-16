import { useMemo } from "react";
import styles from "./TextArea.module.css";

type CustomTextAreaProps = {
  width?: string;
  height?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
};

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & CustomTextAreaProps;

export function TextArea(props: Props) {
  const { width, height, label, ...rest } = props;

  const classNames = useMemo(() => {
    const classNames = [styles.textarea];
    return classNames;
  }, []);

  return (
    <div className={styles.container} style={{ width }}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={classNames.join(" ")}
        style={{ height }}
        {...rest}
      />
    </div>
  );
}