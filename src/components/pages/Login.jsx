import LoginForm from "../forms/LoginForm";

export default function Login({ setAuth }) {
  return (
    <div className="login-container">
      <h1>Login</h1>
      <LoginForm setAuth={setAuth} />
    </div>
  );
}
