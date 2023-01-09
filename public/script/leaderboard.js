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

var leaderboardScores = {
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
    {
      id: 825,
      user: "dtf",
      score: 10.4,
    },
    {
      id: 181,
      user: "susman",
      score: 10.51,
    },
    {
      id: 495,
      user: "rizzyneutron",
      score: 11.62,
    },
    {
      id: 166,
      user: "niem",
      score: 14.31,
    },
  ],
  classic40: [],
  classic60: [],
  timed15: [],
  timed30: [],
  timed45: [],
};

function checkIfLoggedIn() {
  username = localStorage.getItem("username");
  console.log("hello " + username);
  if (username == null) {
    window.location.replace("https://sequence.marlonfajardo.ca/login");
  }
}

function getHighScore(scores) {
  checkIfLoggedIn();
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", url + `/scores/${username}`, true);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let highScore = JSON.parse(this.responseText)[0][0];
      console.log(highScore);
      fillLeaderboard(scores, highScore);
    }
  };
}

function getScores() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", url + `/scores`, true);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      getHighScore(leaderboardScores);
      //   getHighScore(JSON.parse(this.responseText));
      console.log(JSON.parse(this.responseText));
    }
  };
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

function createLeaderboardEntry(scoreObj, place, color) {
  let window = document.getElementById("leaderboard");
  let placeText = createSpanElement("place", place, place, color);
  let usernameText = createSpanElement(
    "username",
    place,
    scoreObj["user"],
    color
  );
  let score = formatScore(scoreObj["score"]);
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

function displayHighScore(highScore) {
  let color = "#EAAA00";
  let place = highScore["place"];
  let window = document.getElementById("leaderboard");
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

function loadLeaderboard(scores, gameMode) {
  let leaderBoardSize = getSize(scores);
  if (scores != []) {
    for (let index = 0; index < leaderBoardSize; index++) {
      if (scores[index]["user"] == username) {
        userIsInTop10 = true;
        createLeaderboardEntry(scores[index], place, "#EAAA00");
      } else {
        createLeaderboardEntry(scores[index], place, "white");
      }
      place++;
    }
    if (!userIsInTop10) {
      displayHighScore(highScore);
    }
  }
}

function fillLeaderboard(scores, highScore) {
  let userIsInTop10 = false;
  let place = 1;
  let leaderBoardSize = getSize(scores);
  document.getElementById("loader").remove();
  document.getElementById("gameModes").style.display = "flex";
  document.getElementById("classicGameSizes").style.display = "flex";
  game_modes.array.forEach((gameMode) => {
    loadLeaderboard(scores[gameMode], gameMode);
  });
}

function toggleDisplayGameSizes(toToggle, mode) {
  toToggle = `${toToggle}GameSizes`;
  console.log(toToggle);
  document.getElementById(toToggle).style.display = mode;
}

function switchGameMode(toBeSelected) {
  console.log(toBeSelected);
  if (toBeSelected != selected_game_mode) {
    let previouslySelected = selected_game_mode;
    selected_game_mode = toBeSelected;
    document.getElementById(previouslySelected).classList.remove("selected");
    document.getElementById(toBeSelected).classList.add("selected");
    toggleDisplayGameSizes(selected_game_mode, "flex");
    toggleDisplayGameSizes(previouslySelected, "none");
  }
}

function switchGameSize(toBeSelected) {
  let clickedGameMode = toBeSelected.replace(/[^a-z]/g, "");
  let previouslySelected = selected_game_size[clickedGameMode];
  selected_game_size[clickedGameMode] = toBeSelected;
  document.getElementById(previouslySelected).classList.remove("selected");
  document.getElementById(toBeSelected).classList.add("selected");
}

function enableGameMenu() {
  let gameModes = document.getElementsByClassName("gameModeText");
  let gameSizes = document.getElementsByClassName("gameSizeText");
  for (let index = 0; index < gameModes.length; index++) {
    gameModes[index].addEventListener("click", function () {
      switchGameMode(gameModes[index].id);
      // alert(gameSizes[index].id);
    });
  }
  for (let index = 0; index < gameSizes.length; index++) {
    gameSizes[index].addEventListener("click", function () {
      switchGameSize(gameSizes[index].id, gameSizes[index].classList[0]);
      // alert(gameSizes[index].id);
    });
  }
}

// getScores();
document.getElementById("back").onclick = function () {
  window.location.replace("https://sequence.marlonfajardo.ca");
};
enableGameMenu();
