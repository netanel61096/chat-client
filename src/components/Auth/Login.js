import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../store/userSlice";
import { loginUser } from "../../services/authApi";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userData = await loginUser(email, password);
      dispatch(login(userData));
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}

        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleLogin} className={styles.button}>Login</button>
        <p className={styles.p}> 
          Don't have an account? <Link to="/register" className={styles.a}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

