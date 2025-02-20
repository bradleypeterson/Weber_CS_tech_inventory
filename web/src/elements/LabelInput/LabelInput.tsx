import { useMemo } from "react";
import styles from "./LabelInput.module.css";

type CustomInputProps = {
  width?: string;
  placeholder?: string;
  label?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
};

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & CustomInputProps;

export function LabelInput(props: Props) {
  const classNames = useMemo(() => {
    const classNames = [styles.input];
    return classNames;
  }, [ ]);

  return (
    <div className={styles.container} style={{ width: props.width }}>
        <label className={styles.label}>{props.label}</label>
        <input
          type="text"
          className={classNames.join(" ")} {...props}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange && props.onChange(e.target.value)} 
        ></input>
    </div>
  );
}