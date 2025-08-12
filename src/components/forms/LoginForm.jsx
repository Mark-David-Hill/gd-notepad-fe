import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContextProvider";

const LoginForm = () => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSetEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSetPassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        console.error("Login failed:", result.message);
      }
    }
  };

  return (
    <form className="login" onSubmit={handleLogin}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        autoComplete="email"
        value={email}
        onChange={handleSetEmail}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={handleSetPassword}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
