const url = "https://marlonfajardo.ca/sequence/v1";
let username;

function checkIfLoggedIn() {
    username = localStorage.getItem("username");
    if(username == null) {
        window.location.replace("https://marlonfajardo.ca/sequence");
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
    }
}

function getScores() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + `/scores`, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getHighScore(JSON.parse(this.responseText));
        }
    }
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

function createLeaderboardEntry(scoreObj, place) {
    const color = "white";
    let window = document.getElementById("leaderboard");
    let placeText = createSpanElement("place", place, place, color);
    let usernameText = createSpanElement("username", place, scoreObj['user'], color);
    let timeText = createSpanElement("time", place, scoreObj['score'], color);
    let card = createCard(placeText, usernameText, timeText, place);
    window.appendChild(card);
}

function getSize(scores) {
    if (scores.length <= 10) {
        return scores.length
    } else {
        return 10;
    }
}

function displayHighScore(highScore) {
    let color = "#EAAA00";
    let place = highScore['place'];
    let window = document.getElementById("leaderboard");
    let placeText = createSpanElement("place", place, place, color);
    let usernameText = createSpanElement("username", place, highScore['user'], color);
    let timeText = createSpanElement("time", place, highScore['score'], color);
    let card = createCard(placeText, usernameText, timeText, place);
    window.appendChild(card);
}

function fillLeaderboard(scores, highScore) {
    let userIsInTop10 = false;
    let place = 1;
    let leaderBoardSize = getSize(scores);
    document.getElementById("leaderboard").innerHTML = "";
    for (let index=0; index<leaderBoardSize; index++) {
        if (scores[index]['user'] == username) {
            userIsInTop10 = true;
        }
        createLeaderboardEntry(scores[index], place);
        place++;
    }
    if (!userIsInTop10) {
        displayHighScore(highScore);
    }
}

getScores();
document.getElementById("back").onclick = function () {
    window.location.replace("https://marlonfajardo.ca/sequence/game");
}