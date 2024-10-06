import LoginForm from "../LoginForm";

export default function Login({ setAuth }) {
  return (
    <div className="login-container">
      <h1>Login</h1>
      <LoginForm setAuth={setAuth} />
    </div>
  );
}
