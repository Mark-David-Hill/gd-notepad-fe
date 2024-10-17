import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWrapper from "../lib/apiCall";

const LoginForm = ({ setAuth }) => {
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
      console.log("Login successful:", response);
      if (response.message === "login successful") {
        setAuth(true);
        navigate("/dashboard");
      } else {
        console.error("Login failed:", response.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
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
