var current_score = 0.0;
let timer;
let timer_is_active = false;

function startTimer() {
   timer_is_active = true;
   document.getElementById("btn").onclick = pauseTimer;
   document.getElementById("btn").innerText = "puase";
   let startTime;
   if (current_score == 0.0) {
      startTime = 0.0;
   } else if (current_score > 0.0) {
      let timeElement = document.getElementById("time");
      let timeText = timeElement.innerText;
      startTime = parseFloat(timeText.match(/(\d+.\d+)/));
   }
   let startTimestamp = Date.now();
   timer = setInterval(function () {
      let elapsedTime = (Date.now() - startTimestamp) / 1000;
      let timerValue = (elapsedTime + startTime).toFixed(2);
      timeElement.innerText = timerValue;
   }, 50);
}

function pauseTimer() {
  if(timer_is_active) {
    clearInterval(timer);
    timer_is_active = false;
    let timeElement = document.getElementById("time");
    let timeText = timeElement.innerText;
    current_score = parseFloat(timeText.match(/(\d+.\d+)/));
    alert(`Current score is: ${current_score}`);
    document.getElementById("btn").onclick = startTimer;
    document.getElementById("btn").innerText = "start";
  }
}

document.getElementById("btn").onclick = startTimer;