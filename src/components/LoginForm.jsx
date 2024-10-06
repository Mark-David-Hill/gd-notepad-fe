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
    const body = {
      email: email,
      password: password,
    };

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

  const handleLogin = () => {
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
