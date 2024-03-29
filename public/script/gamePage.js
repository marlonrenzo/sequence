const url = "https://sequence.marlonfajardo.ca/server/v2";
let GAME_SIZE;
let BUTTONS_TO_DISPLAY = 9;
let timer_is_active = false;
let timer;
let current_score = 0.0;
const game_modes = { classic: startClassicGame, timed: startTimedGame };
let selected_game_mode = "classic";
let selected_game_size = {
  classic: "classic20",
  timed: "timed15",
};
let pausedTimeStamp;
let high_scores = {};
let testScores = {
  classic20: {
    user: "marlon",
    score: 5.48,
  },
  classic40: {
    user: "rizzyneutron",
    score: 21.45,
  },
  classic60: {
    user: "marlon",
    score: 23.4,
  },
  timed15: {
    user: "marlon",
    score: 33,
  },
  timed30: {
    user: "kathy",
    score: 51,
  },
  timed45: {
    user: "kathy",
    score: 68,
  },
};

function createNewButton(number, xPos, yPos) {
  let div = document.getElementById("gameWindow");
  let btn = document.createElement("button");
  btn.id = "btn" + number;
  btn.className = "sequenceButton";
  btn.transition = "1000ms";
  btn.onclick = function () {
    removeButtonAfterClick(btn.id);
  };
  btn.innerHTML = `<div id="div${number}">${number}</div>`;
  btn.style.position = "absolute";
  btn.style.marginTop = `${yPos}px`;
  btn.style.marginLeft = `${xPos}px`;
  div.appendChild(btn);
}

function createNewButtonInvisible(number, xPos, yPos) {
  let div = document.getElementById("gameWindow");
  let btn = document.createElement("button");
  btn.id = "btn" + number;
  btn.className = "sequenceButton";
  btn.onclick = function () {
    removeButtonAfterClick(btn.id);
  };
  btn.innerHTML = `<div id="div${number}">${number}</div>`;
  btn.style.position = "absolute";
  btn.style.marginTop = `${yPos}px`;
  btn.style.marginLeft = `${xPos}px`;
  btn.style.opacity = "0.0";
  btn.style.boxShadow = "none";
  div.appendChild(btn);
}

function displayButton(id) {
  let btn = document.getElementById(id);
  btn.style.opacity = "1.0";
  btn.style.boxShadow =
    "0 4px 8px 0 rgba(0, 0, 0, 0.8), 0 6px 20px 0 rgba(0, 0, 0, 0.5)";
  btn.style.transition = "1000ms";
}

function activateFinalButton(currentNum) {
  if (currentNum == GAME_SIZE) {
    let finalBtn = document.getElementById("btn" + GAME_SIZE);
    finalBtn.onclick = function () {
      removeButton("btn" + GAME_SIZE);
      stopGame();
    };
  }
}

function revealButton(currentNum) {
  let buttonToReveal = parseInt(currentNum) + BUTTONS_TO_DISPLAY;
  displayButton("btn" + buttonToReveal);
}

function getIntegerFromString(string) {
  number = string.match(/\d+/)[0];
  return number;
}

function removeButtonAfterClick(id) {
  let clickedNumber = getIntegerFromString(id);
  let currentNumber = document.getElementById("currentNumber").innerText;
  if (clickedNumber == currentNumber) {
    if (
      selected_game_mode == "timed" ||
      currentNumber <= GAME_SIZE - BUTTONS_TO_DISPLAY
    ) {
      revealButton(currentNumber);
      current_score += 1;
    }
    currentNumber++;
    document.getElementById("currentNumber").innerText = currentNumber;
    removeButton(id);
  } else {
    wrongButtonClicked(id);
  }
  if (selected_game_mode == "classic") {
    activateFinalButton(currentNumber);
  }
}

function wrongButtonClicked(id) {
  let currentElm = document.getElementById(id);
  let currentNum = document.getElementById("currentNum");

  currentNum.style.animation = "shake 0.5s";
  currentElm.style.animation = "shake 0.5s";
  document.body.style.backgroundColor = "#734343";

  setTimeout(function () {
    document.body.style.backgroundColor = "#333333";
    document.body.style.transition = "200ms";
    currentElm.style.animation = "none";
    currentNum.style.animation = "none";
  }, 750);
}

function removeButton(id) {
  let div = document.getElementById("gameWindow");
  let currentElm = document.getElementById(id);
  currentElm.onclick = "";
  currentElm.style.zIndex = "-1";
  currentElm.style.transition = "1000ms";
  currentElm.style.backgroundColor = "#EAAA00";
  currentElm.style.opacity = "0.0";
  currentElm.style.boxShadow =
    "box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.0), 0 6px 20px 0 rgba(0, 0, 0, 0.0)";
  setTimeout(function () {
    div.removeChild(currentElm);
  }, 1000);
}

function spawnButtons(gameMode) {
  let div = document.getElementById("gameWindow");
  let yLimit = div.offsetHeight - 100;
  let xLimit = div.offsetWidth - 100;
  let gameSize;
  if (gameMode == "classic") {
    gameSize = GAME_SIZE;
  } else if (gameMode == "timed") {
    gameSize = 200;
  }
  for (let num = gameSize; num >= 1; num--) {
    let randomX = randomNumber(xLimit);
    let randomY = randomNumber(yLimit);
    if (num <= BUTTONS_TO_DISPLAY) {
      createNewButton(num, randomX, randomY);
    } else {
      createNewButtonInvisible(num, randomX, randomY);
    }
  }
}

function randomNumber(max) {
  return Math.floor(Math.random() * max);
}

function removeMenu() {
  document.getElementById("gameMenu").style.display = "none";
  document.getElementById("logout").style.display = "none";
}

function getCurrentTimestamp() {
  let timeElement = document.getElementById("time").innerText;
  let time = parseFloat(timeElement.match(/(\d+.\d+)/));
  if (time < 0.0) {
    resetTimer();
  }
  return time;
}

function startTimer() {
  if (selected_game_mode == "classic") {
    startClassicTimer();
  } else {
    startTimedTimer();
  }
}

function getInitialTimestamp() {
  let currentTimestamp = getCurrentTimestamp();
  if (currentTimestamp == GAME_SIZE) {
    return GAME_SIZE;
  } else if (currentTimestamp < GAME_SIZE && currentTimestamp > 0) {
    return currentTimestamp;
  }
}

function startTimedTimer() {
  timer_is_active = true;
  let timeElement = document.getElementById("time");
  let startTimestamp = Date.now();
  let initialTime = getInitialTimestamp();
  let currentTimestamp;
  timer = setInterval(function () {
    let timeDifference = (Date.now() - startTimestamp) / 1000;
    currentTimestamp = initialTime - timeDifference;
    timeElement.innerText = `${currentTimestamp.toFixed(1)}s`;
    if (currentTimestamp <= 0.05) {
      timeElement.innerText = `0.0s`;
      stopGame();
    }
  }, 50);
}

function startClassicTimer() {
  timer_is_active = true;
  let timeElement = document.getElementById("time");
  let currentTimestamp = getCurrentTimestamp();
  let startTimestamp = Date.now();
  timer = setInterval(function () {
    let timeDifference = (Date.now() - startTimestamp) / 1000;
    let elapsedTime = (currentTimestamp + timeDifference).toFixed(2);
    current_score = parseFloat(elapsedTime);
    timeElement.innerText = `${current_score.toFixed(1)}s`;
  }, 50);
}

function stopTimer() {
  if (timer_is_active) {
    timer_is_active = false;
    clearInterval(timer);
  }
}

function resetTimer() {
  let timeElement = document.getElementById("time");
  if (selected_game_mode == "classic") {
    timeElement.innerText = "0.0s";
  } else if (selected_game_mode == "timed") {
    timeElement.innerText = `${GAME_SIZE}.0s`;
  }
}

function stopGame() {
  let username = localStorage.getItem("username");
  // let username = "marlon";
  stopTimer();
  uploadScore();
  setTimeout(function () {
    console.log("Finished " + selected_game_mode + GAME_SIZE);
    if (selected_game_mode == "classic") {
      alert(`Good job ${username}! You finished in ${current_score} seconds!`);
    } else if (selected_game_mode == "timed") {
      alert(
        `Good job ${username}! You finished with a score of ${current_score}`
      );
    }
    resetGameWindow();
  }, 1000);
}

function initializeCounter() {
  document.getElementById("currentNumber").innerText = 1;
  document.getElementById("currentNumber").style.color = "white";
  document.getElementById("time").style.display = "inline-block";
}

function countDown() {
  document.getElementById("overlay").style.display = "block";
  let text = document.getElementById("countdown");
  text.innerHTML = 3;
  setTimeout(function () {
    text.innerHTML = 2;
    setTimeout(function () {
      text.innerHTML = 1;
      setTimeout(function () {
        text.display = "none";
        document.getElementById("overlay").style.display = "none";
      }, 1000);
    }, 1000);
  }, 1000);
}

function getHighScore() {
  // highScore.innerText = `👑 6.9s (marlon)`; // placeholder
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", url + `/highscores`, true);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let result = JSON.parse(this.responseText);
      console.log(result);
      for (let mode = 0; mode < 6; mode++) {
        let currentMode = Object.keys(result)[mode];
        let currentHighScore;
        if (mode <= 3) {
          let roundedScore = Math.floor(result[currentMode]["score"] * 10) / 10;
          let scoreFormatted = roundedScore.toFixed(1);
          currentHighScore = `${scoreFormatted}s (${result[currentMode]["user"]})`;
        } else {
          currentHighScore = `${result[currentMode]["score"]} (${result[currentMode]["user"]})`;
        }
        high_scores[currentMode] = currentHighScore;
      }
      displayIntitialHighScore();
    }
  };
  // let result = testScores;
  // for (let mode = 0; mode < 6; mode++) {
  //   let currentMode = Object.keys(result)[mode];
  //   let currentHighScore;
  //   if (mode <= 3) {
  //     let roundedScore = Math.floor(result[currentMode]["score"] * 10) / 10;
  //     let scoreFormatted = roundedScore.toFixed(1);
  //     currentHighScore = `${scoreFormatted}s (${result[currentMode]["user"]})`;
  //   } else {
  //     currentHighScore = `${result[currentMode]["score"]} (${result[currentMode]["user"]})`;
  //   }
  //   high_scores[currentMode] = currentHighScore;
  // }
  // displayIntitialHighScore();
}

function uploadScore() {
  let username = localStorage.getItem("username");
  const xhttp = new XMLHttpRequest();
  let gameModeSize = selected_game_size[selected_game_mode];
  xhttp.open(
    "PUT",
    url + `/scores/${username}/${current_score}/${gameModeSize}`,
    true
  );
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let result = JSON.parse(this.responseText)[0];
      if (result[0]["ROW_COUNT()"] === 1) {
        console.log(
          `Successfully logged ${current_score} for ${username} in ${gameModeSize}`
        );
      } else {
        console.log("Error uploading");
      }
    }
  };
}

function visitLeaderboard() {
  window.location.replace("https://sequence.marlonfajardo.ca/leaderboard");
}

function displayMainMenu() {
  document.getElementById("mainMenu").style.display = "flex";
  document.getElementById("logout").style.display = "inline-block";
  activateLogout();
}

function resetGameWindow() {
  clearButtons();
  displayMainMenu();
  document.getElementById("currentNumber").innerText = "Sequence";
  document.getElementById("currentNumber").style.color = "#43c4be";
  document.getElementById("pauseOverlay").style.display = "none";
  document.getElementById("pause").style.display = "none";
  resetTimer();
  document.getElementById("time").style.display = "none";
}

function clearButtons() {
  let gameWindow = document.getElementById("gameWindow");
  gameWindow.innerHTML = "";
}

function quit() {
  document.getElementById("pauseOverlay").style.display = "none";
  resetGameWindow();
}

function resume() {
  document.getElementById("pauseOverlay").style.display = "none";
  console.log("resuming");
  countDown();
  setTimeout(function () {
    startTimer();
    document.getElementById("pause").style.display = "block";
  }, 3000);
}

function pause() {
  stopTimer();
  document.getElementById("pause").style.display = "none";
  document.getElementById("resume").onclick = resume;
  document.getElementById("quit").onclick = quit;
  document.getElementById("pauseOverlay").style.display = "block";
}

function showPauseButton() {
  document.getElementById("pause").style.display = "inline-block";
  document.getElementById("pause").onclick = pause;
}

function startClassicGame() {
  initializeCounter();
  removeMenu();
  countDown();
  setTimeout(function () {
    showPauseButton();
    spawnButtons(selected_game_mode);
    startTimer();
  }, 3000);
}

function startTimedGame() {
  initializeCounter();
  resetTimer();
  removeMenu();
  countDown();
  setTimeout(function () {
    showPauseButton();
    spawnButtons(selected_game_mode);
    startTimer();
  }, 3000);
}

function resetGameMenuAnimation() {
  let gameSizes = document.querySelectorAll(".gameSizes");
  gameSizes.forEach((size) => {
    console.log(size);
    size.style.animation = "reveal-top 1s";
  });
}

function switchToMainMenu() {
  document.getElementById("gameMenu").style.display = "none";
  resetGameMenuAnimation();
  displayMainMenu();
}

function switchToGameMenu() {
  // getHighScore();
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById("gameMenu").style.display = "flex";
  document.getElementById("back").onclick = switchToMainMenu;
}

function switchHighScore(gameSize) {
  let highScoreElm = document.getElementById("selectedHighScore");
  highScoreElm.innerText = high_scores[gameSize.id];
}

function switchGameSizeOptions(toHide, toDisplay) {
  let previousGameSizes = document.getElementById(`${toHide}GameSizes`);
  let newGameSizes = document.getElementById(`${toDisplay}GameSizes`);
  previousGameSizes.style.display = "none";
  newGameSizes.style.animation = "none";
  newGameSizes.style.display = "flex";
}

function switchGameMode(newModeElm) {
  let previousModeElm = document.getElementById(selected_game_mode);
  previousModeElm.classList.remove("selected");
  newModeElm.classList.add("selected");
  switchGameSizeOptions(selected_game_mode, newModeElm.id);
  selected_game_mode = newModeElm.id;
  // determineGameSize();
}

function switchGameSize(newGameSize) {
  let previousGameSize = selected_game_size[selected_game_mode];
  let previousGameSizeElm = document.getElementById(previousGameSize);
  newGameSize.classList.add("selected");
  previousGameSizeElm.classList.remove("selected");
  selected_game_size[selected_game_mode] = newGameSize.id;
}

function displayIntitialHighScore() {
  document.getElementById("highScoresDiv").style.display = "block";
  let highScoreElm = document.getElementById("selectedHighScore");
  highScoreElm.innerText = high_scores["classic20"];
}

function determineGameMode(string) {
  if (string.startsWith("classic")) {
    return "classic";
  } else {
    return "timed";
  }
}

function determineGameSize() {
  let selectedSize = selected_game_size[selected_game_mode];
  GAME_SIZE = getIntegerFromString(selectedSize);
}

function startGame() {
  determineGameSize();
  let run_game = game_modes[selected_game_mode];
  current_score = 0.0;
  run_game();
  console.log("Game size: " + GAME_SIZE);
  console.log("Game mode: " + selected_game_mode);
}

function enableGameMenu() {
  let gameModes = document.querySelectorAll("span.gameModeLabel");
  let gameSizes = document.querySelectorAll("span.gameSize");
  gameModes.forEach((gameMode) => {
    gameMode.addEventListener("click", function () {
      if (gameMode.id != selected_game_mode) {
        let selectedModeSize = selected_game_size[gameMode.id];
        let newGameSize = document.getElementById(selectedModeSize);
        switchHighScore(newGameSize);
        switchGameMode(gameMode);
      }
    });
  });
  gameSizes.forEach((gameSize) => {
    gameSize.addEventListener("click", function () {
      if (gameSize.id != selected_game_size[selected_game_mode]) {
        switchHighScore(gameSize);
        switchGameSize(gameSize);
      }
    });
  });
  document.getElementById("startGame").onclick = function () {
    startGame();
  };
}

function welcomeUser(name) {
  let div = document.createElement("div");
  let style = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                font-size: 40px;
                text-align: center;
                color: white;
                transform: translate(-50%,-50%);
                -ms-transform: translate(-50%,-50%);
                animation: disappear 1.5s`;
  div.innerHTML = "Welcome, " + name;
  div.style = style;
  document.body.appendChild(div);
  setTimeout(function () {
    document.body.removeChild(div);
  }, 1250);
}

function activateLogout() {
  document.getElementById("logout").onclick = function () {
    localStorage.clear();
    window.location.replace("https://sequence.marlonfajardo.ca/login");
  };
}

function redirectToAdminPage() {
  window.location.replace(
    "https://marlonfajardo.ca/sequence/views/pages/admin.html"
  );
}

function activateAdminMode() {
  let window = document.getElementById("mainMenu");
  let btn = document.createElement("button");
  btn.style = `
        width: 300px;
        font-size: 40px;
        height: 100px;
        border: 0;
        border-radius: 5px;
        font-family: 'Titillium Web';
        background-color: #c44349;
        color: white;
        margin: 5px;
        animation: reveal-bottom 1s;`;
  btn.id = "adminBtn";
  btn.innerText = "Admin Page";
  btn.onclick = redirectToAdminPage;
  window.appendChild(btn);
}

function checkIfLoggedIn() {
  let username = localStorage.getItem("username");
  // let username = "marlon";
  if (username === "admin") {
    console.log(username);
    activateAdminMode();
  }
  if (username !== null) {
    document.getElementById("start").onclick = switchToGameMenu;
    document.getElementById("leaderboard").onclick = visitLeaderboard;
    welcomeUser(username);
    setTimeout(displayMainMenu, 1000);
  } else {
    window.location.replace("https://sequence.marlonfajardo.ca/login");
  }
}

function fixMobileSizing() {
  if (window.innerWidth <= 620) {
    let vh = window.innerHeight * 0.01;
    document.body.style.setProperty("--vh", `${vh}px`);
  }
}

getHighScore();
fixMobileSizing();
checkIfLoggedIn();
enableGameMenu();
