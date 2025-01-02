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
        webview.addEventListener('ipc-message', (event) => {
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
              break;
          }
        })
        webview.send('ping')
      })
  }

  // Print button exits
  if (document.querySelector("#print_button")) {
    document
      .querySelector("#print_button")
      .addEventListener("click", function () {
        const webview = document.querySelector('webview')
        webview.addEventListener('ipc-message', (event) => {
          switch (event.channel) {
            case "recording":
              this.innerText = "Recording Video...";
              break;
            case "complete":
              this.innerText = "Record Video";
              break;
          }
        })
        webview.send('ping')
      });
  }
});
