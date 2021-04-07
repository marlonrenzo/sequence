var url = "https://diyarsalamatravandi.ca/sequence/v1";

function getScores() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + `/scores`, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            return JSON.parse(this.responseText);
        }
    }
}

function createLeaderboardCard() {
    return;
}

function fillLeaderboard() {
    let place = 1;
    let scores = getScores();
    for (let index=0; index<scores.length; index++) {
        createLeaderboardCard(scores[0], place);
        place++;
    }
}