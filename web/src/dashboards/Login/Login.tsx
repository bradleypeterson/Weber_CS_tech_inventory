import { useState } from "react";
import { Button } from "../../elements/Button/Button";
import { LabelInput } from "../../elements/LabelInput/LabelInput";
import styles from "./Login.module.css";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {}

  return (
    <div className={styles.loginBox}>
      <h1 className={styles.title}>Login</h1>
      <LabelInput
        label="Username"
        placeholder="enter your username"
        width="100%"
        value={username}
        onChange={(val) => setUsername(val)}
      />
      <LabelInput
        label="Password"
        placeholder="enter your password"
        width="100%"
        value={password}
        onChange={(val) => setPassword(val)}
      />
      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}

export default Login;
