import { useState } from "react";
// import AddTimerButton from "./components/GameDisplay";
// import TimersList from "./components/TimersList";
import GamesDisplay from "./components/GameDisplay";
import LoginForm from "./components/LoginForm";

function App() {
  const [authToken, setAuthToken] = useState(null);

  // fetch("http://localhost:8086/user/check_login", { credentials: "include" })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data);
  //     if (data.message === "authenticated") {
  //       console.log("User is logged in:", data.user_id);
  //       // Store the auth token for future API requests
  //       setAuthToken(data.authToken);
  //     } else {
  //       console.log("User is not logged in.");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error checking login status:", error);
  //   });

  return (
    <div className="app-container">
      <h1>Timers App</h1>
      <div className="timers-container">
        <LoginForm
          setAuthToken={setAuthToken}
          // setIsUpdatingTimer={setIsUpdatingTimer}
        />
        <GamesDisplay authToken={authToken} />
      </div>
    </div>
  );
}

export default App;
