import React from "react";
import { useNavigate } from "react-router";
import sidebarStyle from "../../components/Sidebar/Sidebar.module.css";
import styles from "./Login.module.css";

export function Login() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/LandingPage/LandingPage");
  };

  return (
    <div className={styles.container}>
      <aside className={sidebarStyle.sidebar}>
        <h1>SCAM</h1>
      </aside>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Login</h1>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Username</label>
          <input type="text" className={styles.input} placeholder="username" />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <input type="password" className={styles.input} placeholder="password" />
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default Login;
