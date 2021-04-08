var url = "https://diyarsalamatravandi.ca/sequence/v1";

function getScores() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + `/scores`, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(this.responseText))
            fillLeaderboard(JSON.parse(this.responseText));
        }
    }
}

function createSpanElement(type, number, text) {
    let element = document.createElement("span");
    element.className = type;
    element.id = `${type}${number}`;
    element.innerText = text;
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
    let window = document.getElementById("leaderboard");
    let placeText = createSpanElement("place", place, place);
    let usernameText = createSpanElement("username", place, scoreObj['user']);
    let timeText = createSpanElement("time", place, scoreObj['score']);
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

function fillLeaderboard(scores) {
    let place = 1;
    let leaderBoardSize = getSize(scores);
    document.getElementById("leaderboard").innerHTML = "";
    for (let index=0; index<leaderBoardSize; index++) {
        createLeaderboardEntry(scores[index], place);
        place++;
    }
}

getScores();
document.getElementById("back").onclick = function () {
    window.location.replace("https://marlonfajardo.ca/sequence");
}