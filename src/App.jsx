import { useState } from "react";
// import AddTimerButton from "./components/GameDisplay";
// import TimersList from "./components/TimersList";
import GamesDisplay from "./components/GameDisplay";
import LoginForm from "./components/LoginForm";

function App() {
  const [isUpdatingTimer, setIsUpdatingTimer] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  return (
    <div className="app-container">
      <h1>Timers App</h1>
      <div className="timers-container">
        <LoginForm
          setAuthToken={setAuthToken}
          setIsUpdatingTimer={setIsUpdatingTimer}
        />
        <GamesDisplay />
        {/* <TimersList
          isUpdatingTimer={isUpdatingTimer}
          setIsUpdatingTimer={setIsUpdatingTimer}
          authToken={authToken}
        />
        <AddTimerButton
          setIsUpdatingTimer={setIsUpdatingTimer}
          authToken={authToken}
        /> */}
      </div>
    </div>
  );
}

export default App;
