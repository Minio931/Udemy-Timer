import classes from "./Main.module.css";
import { useState, useEffect } from "react";

function Main(props) {
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [tiemLeft, setTimeLeft] = useState("0h 0min");

  useEffect(() => {
    const calcProgress = (progress) => {
      const progressOffset = 570 - (570 * progress) / 100;
      setProgress(progressOffset);
    };

    const getTab = async () => {
      /*global chrome*/
      const queryInfo = {
        active: true,
        lastFocusedWindow: true,
      };
      const [tab] = await chrome.tabs.query(queryInfo);

      return tab;
    };

    const checkForUrl = async (tab) => {
      const { url } = tab;

      return url.includes("/course/") ? true : false;
    };

    const sendMessageToScript = async () => {
      const message = {
        from: "React",
        message: "activate",
      };
      const tab = await getTab();
      if (checkForUrl(tab)) {
        const response = await chrome.tabs.sendMessage(tab.id, message);
        const { title, timeLeft, progressPrecentage } = response;

        let hours = (timeLeft / 60).toFixed(2);
        let minutes = Math.round(
          ((hours - Math.floor(hours)) * 100 * 60) / 100
        );
        let rhours = Math.floor(hours);
        setTimeLeft(`${rhours}h ${minutes}min`);
        setTitle(title);
        calcProgress(progressPrecentage);
      }
    };
    sendMessageToScript();

    // const sendTestMessage = async () => {
    //   /*global chrome*/
    //   const message = {
    //     from: "React",
    //     message: "Hello from React App",
    //   };

    //   const queryInfo = {
    //     active: true,
    //     lastFocusedWindow: true,
    //   };

    //   const [tab] = await chrome.tabs.query(queryInfo);
    //   console.log(tab);
    //   const response = await chrome.tabs.sendMessage(tab.id, message);
    //   setUrl(response);
    // };
    // sendTestMessage();
  }, []);

  return (
    <>
      <div className={classes.timer}>
        <svg className={classes.progres_bar}>
          <circle
            cx="100"
            cy="100"
            r="90"
            className={classes["progress_bar__circle"]}
            style={{ strokeDashoffset: `${progress}` }}
          />
        </svg>
        <div className={classes.progress_bar__text}>
          <p>{tiemLeft}</p>
          <p>Time Left</p>
        </div>
      </div>
      <h1 className={classes.title}>{title}</h1>
    </>
  );
}

export default Main;
