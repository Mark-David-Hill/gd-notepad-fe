import { useState } from "react";
import fetchWrapper from "../lib/apiCall";

const LoginForm = ({ setAuthToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSetEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSetPassword = (event) => {
    setPassword(event.target.value);
  };

  async function loginUser(email, password) {
    const response = await fetch("http://localhost:8086/user/auth", {
      // <-- Updated URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important to include cookies
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful:", data);
    } else {
      console.error("Login failed:", await response.json());
    }
  }

  const handleLogin = () => {
    // setIsUpdatingTimer(true);

    const body = {
      email: email,
      password: password,
    };

    if (email && password) {
      loginUser(email, password);
      // fetchWrapper
      //   .apiCall(`/user/auth`, "POST", body)
      //   .then((data) => {
      //     console.log("auth data:", data);
      //     setAuthToken(data.result.auth_token);
      //     // setIsUpdatingTimer(false);
      //   })
      //   .catch((error) => console.error("couldn't login", error));
    }
  };

  return (
    <div className="login">
      <input type="text" placeholder="Email" onChange={handleSetEmail} />
      <input type="text" placeholder="Password" onChange={handleSetPassword} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
