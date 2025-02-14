import { useMemo } from "react";
import styles from "./IconInput.module.css";

type CustomInputProps = {
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
    return classNames;
  }, []);

  return (
    <div className={styles.container} style={{ width: props.width }}>
      <view className={styles.iconInputContainer}>
        <i className={styles.icon}>{props.icon}</i>
        <input
          type="text"
          className={classNames.join(" ")} {...props}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}> 
        </input>
      </view>
    </div>
  );
}
