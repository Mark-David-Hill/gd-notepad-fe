import GamesDisplay from "./components/GameDisplay";
import LoginForm from "./components/LoginForm";

function App() {
  return (
    <div className="app-container">
      <h1>Timers App</h1>
      <div className="timers-container">
        <LoginForm />
        <GamesDisplay />
      </div>
    </div>
  );
}

export default App;
