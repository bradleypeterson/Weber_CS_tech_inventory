import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../../elements/Button/Button";
import { LabelInput } from "../../elements/LabelInput/LabelInput";
import styles from "./Login.module.css";

export function Login() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/LandingPage/LandingPage");
  };

  return (
    <div className={styles.loginBox}>
      <h1 className={styles.title}>Login</h1>
      <LabelInput label="Username" placeholder="enter your username" width="100%" />
      <LabelInput label="Password" placeholder="enter your password" width="100%" />
      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}

export default Login;
