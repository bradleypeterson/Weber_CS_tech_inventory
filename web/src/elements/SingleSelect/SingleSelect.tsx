import { CaretDown } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./SingleSelect.module.css";

type Option = {
  value: string | number;
  label: string;
};

type Props = {
  options: Option[];
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  width?: string;
};

export function SingleSelect(props: Props) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toggleOpen = () => setOpen((prev) => !prev);

  function selectOption(value: string | number) {
    if (props.onChange) props.onChange(value);
    setOpen(false);
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredOptions = useMemo(
    () =>
      searchTerm === ""
        ? props.options
        : props.options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm, props.options]
  );

  const selectedOption = useMemo(
    () => props.options.find((option) => option.value === props.value),
    [props.options, props.value]
  );

  return (
    <div className={styles.container} ref={containerRef} style={{ width: props.width }}>
      <div className={styles.select} onClick={toggleOpen} role="button" aria-haspopup="listbox" aria-expanded={open}>
        <span>{selectedOption ? selectedOption.label : props.placeholder}</span>
        <CaretDown style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.1s ease-in-out" }} />
      </div>
      {open && (
        <div className={styles.dropdown}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            placeholder="Search..."
            autoFocus
          />
          <ul className={styles.optionList} role="listbox">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className={styles.option}
                onClick={() => selectOption(option.value)}
                role="option"
                aria-selected={selectedOption?.value === option.value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
