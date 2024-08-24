import StartStopButton from "./StartStopButton";
import { useEffect, useState } from "react";
import fetchWrapper from "../lib/apiCall";
import DeleteButton from "./DeleteButton";
import Display from "./Display";

const Timer = ({ timerData, setIsUpdatingTimer, authToken }) => {
  const [timerName, setTimerName] = useState(timerData.name);
  const [startTime, setStartTime] = useState(timerData.start_time);
  const [stopTime, setStopTime] = useState(timerData.stop_time);
  const [isStop, setIsStop] = useState(false);

  const timerId = timerData.timer_id;

  useEffect(() => {
    fetchWrapper
      .apiCall(`/timer/${timerId}`, "GET", null, authToken)
      .then((data) => {
        timerData = data.result;

        if (timerData.start_time) {
          setStartTime(timerData.start_time);
        }

        if (timerData.stop_time) {
          setStopTime(timerData.stop_time);
        } else {
          setStopTime("<stop_time>");
        }

        setTimerName(timerData.name);
      });
  }, [isStop]);

  return (
    <div className="timer-wrapper">
      <DeleteButton
        timerId={timerId}
        setIsUpdatingTimer={setIsUpdatingTimer}
        authToken={authToken}
      />
      <div className="name-wrapper">{timerName}</div>
      <Display startTime={startTime} stopTime={stopTime} timerId={timerId} />
      <StartStopButton
        isStop={isStop}
        setIsStop={setIsStop}
        timerId={timerId}
        authToken={authToken}
      />
    </div>
  );
};

export default Timer;
