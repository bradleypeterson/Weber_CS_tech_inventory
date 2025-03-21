import { useState } from "react";
import { login } from "../../api/auth";
import { Button } from "../../elements/Button/Button";
import { LabelInput } from "../../elements/LabelInput/LabelInput";
import { useAuth } from "../../hooks/useAuth";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./Login.module.css";

export function Login() {
  const [userId, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const linkTo = useLinkTo();
  const auth = useAuth();

  async function handleSubmit() {
    const result = await login(userId, password);
    if (result.status === "success") {
      await new Promise((res) => {
        auth.setToken(result.data.token);
        setTimeout(res, 100);
      });
      linkTo("Search", ["Assets"]);
    } else setError(result.error.message);
  }

  return (
    <div className={styles.loginBox}>
      <h1 className={styles.title}>Login</h1>
      {error && <span style={{ color: "red" }}>{error}</span>}
      <LabelInput
        label="User ID"
        placeholder="enter your user ID"
        width="100%"
        value={userId}
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
