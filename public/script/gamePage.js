var url = "https://diyarsalamatravandi.ca/sequence/v1";
var GAME_SIZE = 20;
var BUTTONS_TO_DISPLAY = 9;
var timer_is_active = false;
var timer;

function createNewButton(number, xPos, yPos) {
    let div = document.getElementById("gameWindow");
    let btn = document.createElement("button");
    btn.id = "btn" + number;
    btn.className = "sequenceButton";
    btn.transition = "1000ms";
    btn.onclick = function () { removeButtonAfterClick(btn.id) };
    btn.innerHTML = `<div id="div${number}">${number}</div>`;
    btn.style.position = 'absolute';
    btn.style.marginTop = `${yPos}px`;
    btn.style.marginLeft = `${xPos}px`;
    div.appendChild(btn);
}

function createNewButtonInvisible(number, xPos, yPos) {
    let div = document.getElementById("gameWindow");
    let btn = document.createElement("button");
    btn.id = "btn" + number;
    btn.className = "sequenceButton"
    btn.onclick = function () { removeButtonAfterClick(btn.id) };
    btn.innerHTML = `<div id="div${number}">${number}</div>`;
    btn.style.position = 'absolute';
    btn.style.marginTop = `${yPos}px`;
    btn.style.marginLeft = `${xPos}px`;
    btn.style.color = "#333333";
    btn.style.boxShadow = "none";
    btn.style.backgroundColor = "#333333";
    div.appendChild(btn);
}

function displayButton(id) {
    let btn = document.getElementById(id);
    btn.style.color = "white";
    btn.style.boxShadow = "none";
    btn.style.backgroundColor = "#c44349";
    btn.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.8), 0 6px 20px 0 rgba(0, 0, 0, 0.5)";
    btn.style.transition = "1000ms";
}

function activateFinalButton(currentNum) {
    if (currentNum == GAME_SIZE) {
        let finalBtn = document.getElementById("btn" + GAME_SIZE);
        finalBtn.onclick = function() {
            removeButton("btn" + GAME_SIZE);
            stopGame();
        };
    }
}

function removeButtonAfterClick(id) {
    let clickedNumber = id.match(/\d+/)[0];
    let currentNumber = document.getElementById("currentNumber").innerText;
    if (clickedNumber == currentNumber) {
        if (currentNumber <= GAME_SIZE - BUTTONS_TO_DISPLAY) {
            let buttonToShow = parseInt(currentNumber) + BUTTONS_TO_DISPLAY;
            displayButton("btn" + buttonToShow);
        }
        currentNumber++;
        document.getElementById("currentNumber").innerText = currentNumber;
        removeButton(id);
    } else {
        wrongButtonClicked(id);
    }
    activateFinalButton(currentNumber);
}

function wrongButtonClicked(id) {
    let currentElm = document.getElementById(id);
    let currentNum = document.getElementById("currentNum");

    currentNum.style.animation = "shake 0.5s";
    currentElm.style.animation = "shake 0.5s";
    document.body.style.backgroundColor = "#734343";

    setTimeout(function() {
        document.body.style.backgroundColor = "#333333";
        document.body.style.transition = "200ms";
        currentElm.style.animation = "none";
        currentNum.style.animation = "none";
    }, 750);
}

function removeButton(id) {
    let div = document.getElementById("gameWindow");
    let currentElm = document.getElementById(id);
    currentElm.style.transition = "1000ms";
    currentElm.style.backgroundColor = "#EAAA00"
    currentElm.style.opacity = "0.0";
    currentElm.style.boxShadow = "box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.0), 0 6px 20px 0 rgba(0, 0, 0, 0.0)";
    setTimeout(function() {
        div.removeChild(currentElm)
    }, 1000);
}

function spawnButtons() {
    let div = document.getElementById("gameWindow");
    let yLimit = div.offsetHeight - 100;
    let xLimit = div.offsetWidth - 100;
    for(let num=GAME_SIZE; num>=1; num--) {
        let randomX = randomNumber(xLimit);
        let randomY = randomNumber(yLimit);
        if (num < 10) {
            createNewButton(num, randomX, randomY);
        } else {
            createNewButtonInvisible(num, randomX, randomY);
        }
    }
}

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}


function restartClock() {
    time = 0;
    document.getElementById("timerText").innerHTML = time;
}

function stopClock() {
    clearInterval(countDown);
}

function startClock() {
    countDown = setInterval(function() {
        time++;
        document.getElementById("timerText").innerHTML = time;
    }, 1000);
}

function removeStartButton() {
    document.getElementById("start").style.display = "none";
}

function startTimer() {
    let timeElement = document.getElementById("time");
    let time = timeElement.innerText;
    let currentTime = parseInt(time.match(/\d+/)[0]);
    timer_is_active = true;
    timer = setInterval(function () {
        currentTime++;
        timeElement.innerText = `${currentTime}sec`;
    }, 1000);
}

function stopTimer() {
    if (timer_is_active) {
        let timeElement = document.getElementById("time");
        let time = timeElement.innerText;
        let currentTime = parseInt(time.match(/\d+/)[0]);
        timer_is_active = false;
        clearInterval(timer);
        return currentTime;
    } 
}

function resetTimer() {
    let timeElement = document.getElementById("time");
    timeElement.innerText = "0sec";
}

function stopGame() {
    let username = localStorage.getItem("username");
    let time = stopTimer();
    uploadScore(time);
    setTimeout(function() {
        alert(`Good job ${username}! You finished in ${time} seconds!`);
        document.getElementById("start").style.display = "inline-block";
        document.getElementById("currentNumber").innerText = "Sequence";
        document.getElementById("currentNumber").style.color = "#43c4be";
        resetTimer();
    }, 1000);
    
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
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + `/scores`, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            let highScore = document.getElementById("highScore");
            let score = result[0]['score'];
            let user = result[0]['user'];
            highScore.innerText = `Fastest Time: ${score}s (${user})`
        }
    }
}

function uploadScore(time) {
    let username = localStorage.getItem("username");
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", url + `/scores/${username}/${time}`, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText)[0];
            if (result[0]['ROW_COUNT()'] === 1) {
                console.log(`Successfully logged ${time} for ${username}`);
            } else {
                console.log("Error uploading");
            }
        }
    }
}

function startGame() {
    document.getElementById("currentNumber").innerText = 1;
    document.getElementById("currentNumber").style.color = "white";
    removeStartButton();
    countDown();
    setTimeout(function () {
        spawnButtons();
        startTimer();
    }, 3000);
}

function checkIfLoggedIn() {
    if(localStorage.getItem("username") !== null) {
        document.getElementById("start").onclick = startGame;
    } else {
        window.location.replace("https://marlonfajardo.ca/sequence");
    }
}

function fixMobileSizing() {
    if (window.innerWidth <= 620) {
        let vh = window.innerHeight * 0.01;
        document.body.style.setProperty('--vh', `${vh}px`);
    }
}

fixMobileSizing();
getHighScore();
checkIfLoggedIn();

// spawnButtons();