import { useMemo } from "react";
import styles from "./IconInput.module.css";
type CustomInputProps = {
  variant?: "primary" | "secondary";
  width?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  icon?: JSX.Element;
};

type Props = React.InputHTMLAttributes<HTMLInputElement> & CustomInputProps;

export function IconInput(props: Props) {
  const classNames = useMemo(() => {
    const classNames = [styles.input];
    if (props.variant === "primary") classNames.push(styles.primary);
    if (props.variant === "secondary") classNames.push(styles.secondary);
    if (props.icon) classNames.push(styles.icon);
    return classNames;
  }, [props.variant, props.width, props.placeholder, props.value, props.icon]);

  return (
      <input
        type="text"
        className={classNames.join(" ")} {...props}
        placeholder={props.placeholder}
        onChange={props.onChange}>
        {props.icon && props.icon}  
      </input>
  );
}
