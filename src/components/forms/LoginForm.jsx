import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContextProvider";

const LoginForm = () => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSetEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSetPassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/");
      } else {
        setError(
          result.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login" onSubmit={handleLogin}>
      {error && <div className="login-error">{error}</div>}

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        autoComplete="email"
        value={email}
        onChange={handleSetEmail}
        disabled={isLoading}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={handleSetPassword}
        disabled={isLoading}
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className={isLoading ? "loading" : ""}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
