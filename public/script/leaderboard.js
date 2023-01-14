// const e = require("express");

const url = "https://sequence.marlonfajardo.ca/server/v2";
let username;
var selected_game_mode = "classic";
var selected_game_size = {
  classic: "classic20",
  timed: "timed15",
};

const game_modes = [
  "classic20",
  "classic40",
  "classic60",
  "timed15",
  "timed30",
  "timed45",
];

var highScoresTEMP = {
  // placeholder
  classic20: { id: 613, user: "marlon", score: 5.48, place: 14 },
  classic40: { id: 613, user: "marlon", score: 15.48, place: 14 },
  classic60: { id: 613, user: "marlon", score: 25.48, place: 14 },
  timed15: { id: 613, user: "marlon", score: 40, place: 14 },
  timed30: { id: 613, user: "marlon", score: 60, place: 14 },
  timed45: { id: 613, user: "marlon", score: 80, place: 14 },
};

var leaderboardScores = {
  // placeholder
  classic20: [
    {
      id: 613,
      user: "marlon",
      score: 5.48,
    },
    {
      id: 380,
      user: "ajx619",
      score: 5.61,
    },
    {
      id: 822,
      user: "riri",
      score: 6.19,
    },
    {
      id: 329,
      user: "mecayla",
      score: 6.33,
    },
    {
      id: 500,
      user: "rizzardofoz",
      score: 6.69,
    },
    {
      id: 143,
      user: "reigae",
      score: 7.35,
    },
    {
      id: 460,
      user: "maliyah",
      score: 7.38,
    },
    {
      id: 291,
      user: "jit tripping",
      score: 7.38,
    },
    {
      id: 617,
      user: "kathy",
      score: 8.67,
    },
    {
      id: 383,
      user: "mq",
      score: 9.89,
    },
  ],
  classic40: [
    {
      id: 613,
      user: "marlon",
      score: 15.48,
    },
    {
      id: 380,
      user: "ajx619",
      score: 15.61,
    },
    {
      id: 822,
      user: "riri",
      score: 16.19,
    },
    {
      id: 329,
      user: "mecayla",
      score: 16.33,
    },
    {
      id: 500,
      user: "rizzardofoz",
      score: 16.69,
    },
    {
      id: 143,
      user: "reigae",
      score: 17.35,
    },
    {
      id: 460,
      user: "maliyah",
      score: 17.38,
    },
    {
      id: 291,
      user: "jit tripping",
      score: 17.38,
    },
    {
      id: 617,
      user: "kathy",
      score: 18.67,
    },
    {
      id: 383,
      user: "mq",
      score: 19.89,
    },
  ],
  classic60: [
    {
      id: 613,
      user: "marlon",
      score: 25.48,
    },
    {
      id: 380,
      user: "ajx619",
      score: 25.61,
    },
    {
      id: 822,
      user: "riri",
      score: 26.19,
    },
    {
      id: 329,
      user: "mecayla",
      score: 26.33,
    },
    {
      id: 500,
      user: "rizzardofoz",
      score: 26.69,
    },
    {
      id: 143,
      user: "reigae",
      score: 27.35,
    },
    {
      id: 460,
      user: "maliyah",
      score: 27.38,
    },
    {
      id: 291,
      user: "jit tripping",
      score: 27.38,
    },
    {
      id: 617,
      user: "kathy",
      score: 28.67,
    },
    {
      id: 383,
      user: "mq",
      score: 29.89,
    },
  ],
  timed15: [
    {
      id: 613,
      user: "marlon",
      score: 40,
    },
    {
      id: 380,
      user: "ajx619",
      score: 39,
    },
    {
      id: 822,
      user: "riri",
      score: 38,
    },
    {
      id: 329,
      user: "mecayla",
      score: 37,
    },
    {
      id: 500,
      user: "rizzardofoz",
      score: 36,
    },
    {
      id: 143,
      user: "reigae",
      score: 35,
    },
    {
      id: 460,
      user: "maliyah",
      score: 34,
    },
    {
      id: 291,
      user: "jit tripping",
      score: 33,
    },
    {
      id: 617,
      user: "kathy",
      score: 32,
    },
    {
      id: 383,
      user: "mq",
      score: 31,
    },
  ],
  timed30: [
    {
      id: 613,
      user: "marlon",
      score: 60,
    },
    {
      id: 380,
      user: "ajx619",
      score: 59,
    },
    {
      id: 822,
      user: "riri",
      score: 58,
    },
    {
      id: 329,
      user: "mecayla",
      score: 57,
    },
    {
      id: 500,
      user: "rizzardofoz",
      score: 56,
    },
    {
      id: 143,
      user: "reigae",
      score: 55,
    },
    {
      id: 460,
      user: "maliyah",
      score: 54,
    },
    {
      id: 291,
      user: "jit tripping",
      score: 53,
    },
    {
      id: 617,
      user: "kathy",
      score: 52,
    },
    {
      id: 383,
      user: "mq",
      score: 51,
    },
  ],
  timed45: [
    {
      id: 613,
      user: "marlon",
      score: 80,
    },
    {
      id: 380,
      user: "ajx619",
      score: 79,
    },
    {
      id: 822,
      user: "riri",
      score: 78,
    },
    {
      id: 329,
      user: "mecayla",
      score: 77,
    },
    {
      id: 500,
      user: "rizzardofoz",
      score: 76,
    },
    {
      id: 143,
      user: "reigae",
      score: 75,
    },
    {
      id: 460,
      user: "maliyah",
      score: 74,
    },
    {
      id: 291,
      user: "jit tripping",
      score: 73,
    },
    {
      id: 617,
      user: "kathy",
      score: 72,
    },
    {
      id: 383,
      user: "mq",
      score: 71,
    },
  ],
};

function checkIfLoggedIn() {
  username = localStorage.getItem("username");
  console.log("hello " + username);
  if (username == null) {
    window.location.replace("https://sequence.marlonfajardo.ca/login");
  } else {
    getScores();
    document.getElementById("back").onclick = function () {
      window.location.replace("https://sequence.marlonfajardo.ca");
    };
  }
}

function getHighScore(scores) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", url + `/scores/${username}`, true);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let highScores = JSON.parse(this.responseText)[0];
      console.log(highScores);
      fillLeaderboards(scores, highScores);
    }
  };
  // fillLeaderboards(scores, highScoresTEMP);
}

function getScores() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", url + `/scores`, true);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      getHighScore(JSON.parse(this.responseText));
      console.log(JSON.parse(this.responseText));
    }
  };
  // getHighScore(leaderboardScores);
}

function createSpanElement(type, number, text, color) {
  let element = document.createElement("span");
  element.className = type;
  element.id = `${type}${number}`;
  element.innerText = text;
  element.style.color = color;
  return element;
}

function createCard(place, name, time, number) {
  let card = document.createElement("div");
  card.id = "card" + number;
  card.className = "card";
  card.appendChild(place);
  card.appendChild(name);
  card.appendChild(time);
  return card;
}

function formatScore(scoreText) {
  let fullScore = parseFloat(scoreText);
  let roundedScore = Math.floor(fullScore * 10) / 10;
  return roundedScore.toFixed(1);
}

function createLeaderboardEntry(gameMode, scoreObj, place, color) {
  let window = document.getElementById(`${gameMode}Leaderboard`);
  let placeText = createSpanElement("place", place, place, color);
  let usernameText = createSpanElement(
    "username",
    place,
    scoreObj["user"],
    color
  );
  let timeText = createSpanElement("time", place, scoreObj["score"], color);
  let card = createCard(placeText, usernameText, timeText, place);
  window.appendChild(card);
}

function getSize(scores) {
  if (scores.length <= 10) {
    return scores.length;
  } else {
    return 10;
  }
}

function displayHighScore(highScore, gameMode) {
  let color = "#EAAA00";
  let place = highScore["place"];
  let window = document.getElementById(`${gameMode}Leaderboard`);
  let placeText = createSpanElement("place", place, place, color);
  let usernameText = createSpanElement(
    "username",
    place,
    highScore["user"],
    color
  );
  let timeText = createSpanElement("time", place, highScore["score"], color);
  let card = createCard(placeText, usernameText, timeText, place);
  window.appendChild(card);
}

function loadLeaderboard(scores, gameMode, highScore) {
  let userIsInTop10 = false;
  let place = 1;
  let leaderBoardSize = getSize(scores);
  if (scores != []) {
    for (let index = 0; index < leaderBoardSize; index++) {
      if (scores[index]["user"] == username) {
        userIsInTop10 = true;
        console.log(`user in top 10 ${gameMode}`);
        createLeaderboardEntry(gameMode, scores[index], place, "#EAAA00");
      } else {
        createLeaderboardEntry(gameMode, scores[index], place, "white");
      }
      place++;
    }
    if (!userIsInTop10) {
      displayHighScore(highScore, gameMode);
    }
  }
}

function createLeaderboardElm(gameMode) {
  let leaderboard = document.createElement("div");
  leaderboard.id = `${gameMode}Leaderboard`;
  leaderboard.classList.add("leaderboard");
  if (selected_game_size[selected_game_mode] == gameMode) {
    leaderboard.style.display = "flex";
  } else {
    leaderboard.style.display = "none";
  }
  return leaderboard;
}

function fillLeaderboards(scores, highScores) {
  enableGameMenu();
  let window = document.getElementsByClassName("window")[0];
  document.getElementById("loaderOverlay").remove();
  Array.prototype.forEach.call(game_modes, (gameMode) => {
    let leaderboard = createLeaderboardElm(gameMode);
    window.appendChild(leaderboard);
    loadLeaderboard(scores[gameMode], gameMode, highScores[gameMode]);
  });
}

function toggleLeaderboard(toToggle, mode) {
  let leaderboardToggle = `${toToggle}Leaderboard`;
  document.getElementById(leaderboardToggle).style.display = mode;
}

function toggleDisplayGameSizes(toToggle, mode) {
  let gameSizeToggle = `${toToggle}GameSizes`;
  document.getElementById(gameSizeToggle).style.display = mode;
}

function switchGameMode(toBeSelected) {
  let previouslySelected = selected_game_mode;
  selected_game_mode = toBeSelected;
  document.getElementById(previouslySelected).classList.remove("selected");
  document.getElementById(toBeSelected).classList.add("selected");
  toggleDisplayGameSizes(toBeSelected, "flex");
  toggleDisplayGameSizes(previouslySelected, "none");
}

function switchGameSize(toBeSelected, previouslySelected) {
  console.log(toBeSelected);
  console.log(previouslySelected);
  let clickedGameMode = toBeSelected.replace(/[^a-z]/g, "");
  // let previouslySelected = selected_game_size[clickedGameMode];
  // console.log(toBeSelected);
  selected_game_size[clickedGameMode] = toBeSelected;
  document.getElementById(previouslySelected).classList.remove("selected");
  document.getElementById(toBeSelected).classList.add("selected");
  toggleLeaderboard(toBeSelected, "flex");
  toggleLeaderboard(previouslySelected, "none");
}

function displayGameMenu() {
  document.getElementById("gameModeMenu").style.display = "block";
}

function enableGameMenu() {
  displayGameMenu();
  let gameModes = document.getElementsByClassName("gameModeText");
  let gameSizes = document.getElementsByClassName("gameSizeText");
  for (let index = 0; index < gameModes.length; index++) {
    gameModes[index].addEventListener("click", function () {
      if (gameModes[index].id != selected_game_mode) {
        let previouslySelected = selected_game_mode;
        switchGameMode(gameModes[index].id);
        switchGameSize(
          selected_game_size[gameModes[index].id],
          selected_game_size[previouslySelected]
        );
      }
      // alert(gameSizes[index].id);
    });
  }
  for (let index = 0; index < gameSizes.length; index++) {
    gameSizes[index].addEventListener("click", function () {
      if (selected_game_size[selected_game_mode] != gameSizes[index].id) {
        switchGameSize(
          gameSizes[index].id,
          selected_game_size[selected_game_mode]
        );
      }
      // alert(gameSizes[index].id);
    });
  }
}

checkIfLoggedIn();
// enableGameMenu();
