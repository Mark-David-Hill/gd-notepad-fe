import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import fetchWrapper from "../../lib/apiCall";

import { AuthContext } from "../context/AuthContextProvider";

const LoginForm = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSetEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSetPassword = (event) => {
    setPassword(event.target.value);
  };

  async function loginUser(email, password) {
    const body = { email, password };

    try {
      const response = await fetchWrapper.apiCall(`/user/auth`, "POST", body);
      if (response.message === "login successful") {
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        console.error("Login failed:", response.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      loginUser(email, password);
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
