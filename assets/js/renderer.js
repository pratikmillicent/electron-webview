const getControlsHeight = () => {
  const controls = document.querySelector("#controls");
  if (controls) {
    return controls.offsetHeight;
  }
  return 0;
};

const calculateLayoutSize = () => {
  const webview = document.querySelector("webview");
  const windowWidth = document.documentElement.clientWidth;
  const windowHeight = document.documentElement.clientHeight;
  const controlsHeight = getControlsHeight();
  const webviewHeight = windowHeight - controlsHeight;

  // webview.style.width = windowWidth + "px";
  // webview.style.height = webviewHeight + "px";
};

window.addEventListener("DOMContentLoaded", () => {
  calculateLayoutSize();

  // Dynamic resize function (responsive)
  window.onresize = calculateLayoutSize;

  if (document.querySelector("#capture")) {
    document
      .querySelector("#capture")
      .addEventListener("click", function () {
        let counter = 3;
        const timer = document.getElementById("timer");
        const timerCount = document.getElementById("timer-count");
        let timerInterval;
        const webview = document.querySelector('webview')
        webview.addEventListener('ipc-message', async (event) => {
          switch (event.channel) {
            case "capturing":
              timer.style.visibility = "visible";
              timerCount.innerText = counter;
              timerInterval = setInterval(() => {
                counter -= 1;
                timerCount.innerText = counter;
              }, 1000)
              break;
            case "captured":
              timer.style.visibility = "hidden";
              timerCount.innerText = 3;
              clearInterval(timerInterval);

              const blob = await fetch(event.args)
                .then(res => res.blob())

              const formData = new FormData();
              formData.append("file", blob, new Date().toISOString() + ".png");
              fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData,
                redirect: "follow"
              })
              break;
          }
        })
        webview.send('ping')
      })
  }
});
