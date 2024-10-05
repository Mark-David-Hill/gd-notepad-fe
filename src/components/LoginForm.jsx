import { useState } from "react";
import fetchWrapper from "../lib/apiCall";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSetEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSetPassword = (event) => {
    setPassword(event.target.value);
  };

  async function loginUser(email, password) {
    const body = {
      email: email,
      password: password,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    fetchWrapper
      .apiCall(`/user/auth`, "POST", body, headers)
      .then((response) => console.log("Login successful:", response))
      .catch((error) => console.error("Login failed:", error));
  }

  const handleLogin = () => {
    const body = {
      email: email,
      password: password,
    };

    if (email && password) {
      loginUser(email, password);
    }
  };

  return (
    <div className="login">
      <input type="text" placeholder="Email" onChange={handleSetEmail} />
      <input
        type="password"
        placeholder="Password"
        onChange={handleSetPassword}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
