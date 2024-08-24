import fetchWrapper from "../lib/apiCall";

const StartStopButton = ({ setIsStop, isStop, timerId, authToken }) => {
  const handleStartStop = () => {
    if (!isStop) {
      fetchWrapper
        .apiCall(`/timer/start/${timerId}`, "PATCH", null, authToken)
        .then(() => setIsStop(true))
        .catch((error) => console.error("couldn't start timer"));
    } else {
      fetchWrapper
        .apiCall(`/timer/stop/${timerId}`, "PATCH", null, authToken)
        .then(() => setIsStop(false))
        .catch((error) => console.error("couldn't stop timer"));
    }
  };

  return <button onClick={handleStartStop}>{isStop ? "Stop" : "Start"}</button>;
};

export default StartStopButton;
