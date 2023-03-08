/*global chrome*/
const messageReactAppListener = async (message, sender, response) => {
  console.log("[content.js]. message received: ", { message, sender });

  if (
    sender.id === chrome.runtime.id &&
    message.from === "React" &&
    message.message === "activate"
  ) {
    const title = document.querySelector(
      ".header--header-text--3Z4po"
    ).innerText;

    const sections = document.querySelectorAll(
      `[data-purpose*="section-panel-"]`
    );

    let openSection;
    sections.forEach((section) => {
      if (
        section
          .querySelector(`[data-type*="checkbox"]`)
          .getAttribute("data-checked") !== "checked"
      ) {
        section
          .querySelector(`[data-css-toggle-id*="accordion-panel"]`)
          .querySelector("button")
          .click();
      } else {
        openSection = section;
      }
    });

    const lectures = document.querySelectorAll(
      `[data-purpose*="curriculum-item-"]`
    );
    const proggress = [];

    console.log(lectures.length);
    lectures.forEach((lecture) => {
      let isCompleted = false;
      let time = 0;
      if (lecture.querySelector(`[class*="curriculum-item-link--metadata"]`)) {
        isCompleted = lecture
          .querySelector(".ud-toggle-input-container")
          .querySelector("span").innerText;

        isCompleted = isCompleted.includes("completed") ? true : false;
        console.log(isCompleted);
        time = lecture
          .querySelector(`[class*="curriculum-item-link--metadata"]`)
          .querySelector("span").innerText;

        time.slice(0, time.length - 3);
        time = parseInt(time);
        proggress.push({ isCompleted, time });
      }
    });

    let totalTime = 0;
    let timeLeft = 0;
    let timeCompleted = 0;

    proggress.forEach((lecture) => {
      if (lecture.isCompleted) {
        timeCompleted += lecture.time;
      } else {
        timeLeft += lecture.time;
      }
      totalTime += lecture.time;
    });

    let progressPrecentage = (timeCompleted / totalTime) * 100;
    response({ title, timeLeft, progressPrecentage });

    sections.forEach((section) => {
      section
        .querySelector(`[data-css-toggle-id*="accordion-panel"]`)
        .querySelector("button")
        .click();
    });

    openSection
      .querySelector(`[data-css-toggle-id*="accordion-panel"]`)
      .querySelector("button")
      .click();

    openSection.scrollIntoView();
  }
};

chrome.runtime.onMessage.addListener(messageReactAppListener);
