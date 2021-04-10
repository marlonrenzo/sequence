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
    btn.style.opacity = "0.0";
    btn.style.boxShadow = "none";
    div.appendChild(btn);
}

function displayButton(id) {
    let btn = document.getElementById(id);
    btn.style.opacity = "1.0";
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
        if (currentNumber <= GAME_SIZE - BUTTONS_TO_DISPLAY) {
            revealButton(currentNumber);
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
    currentElm.onclick = "";
    currentElm.style.zIndex = "-1";
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

function removeMenu() {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("logout").style.display = "none";
}

function startTimer() {
    let timeElement = document.getElementById("time");
    let time = timeElement.innerText;
    let currentTime = parseInt(time.match(/\d+/)[0]);
    timer_is_active = true;
    timer = setInterval(function () {
        currentTime++;
        timeElement.innerText = `${currentTime}s`;
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
    timeElement.innerText = "0s";
}

function stopGame() {
    let username = localStorage.getItem("username");
    let time = stopTimer();
    uploadScore(time);
    setTimeout(function() {
        alert(`Good job ${username}! You finished in ${time} seconds!`);
        resetGameWindow();
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
            highScore.innerText = `👑 ${score}s (${user})`
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

function visitLeaderboard() {
    window.location.replace("https://marlonfajardo.ca/sequence/leaderboard");
}

function displayMainMenu() {
    document.getElementById('mainMenu').style.display = "flex";
    document.getElementById('logout').style.display = "inline-block";
    activateLogout();
}

function resetGameWindow() {
    clearButtons();
    displayMainMenu();
    document.getElementById("currentNumber").innerText = "Sequence";
    document.getElementById("currentNumber").style.color = "#43c4be";
    document.getElementById("pauseOverlay").style.display = "none";
    resetTimer();
    document.getElementById("time").style.display = 'none';
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
    console.log("pause");
}

function showPauseButton() {
    document.getElementById("pause").style.display = "inline-block";
    document.getElementById("pause").onclick = pause;
}

function initializeCounter() {
    document.getElementById("currentNumber").innerText = 1;
    document.getElementById("currentNumber").style.color = "white";
    document.getElementById("time").style.display = "inline-block"
}

function startGame() {
    initializeCounter();
    removeMenu();
    countDown();
    setTimeout(function () {
        showPauseButton();
        spawnButtons();
        startTimer();
    }, 3000);
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
    setTimeout(function() {
        document.body.removeChild(div);
    }, 1250);
}

function activateLogout() {
    document.getElementById("logout").onclick = function () {
        localStorage.clear();
        window.location.replace("https://marlonfajardo.ca/sequence");
    }
}

function redirectToAdminPage() {
    window.location.replace("https://marlonfajardo.ca/sequence/views/pages/admin.html");
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
    if (username === "admin") {
        console.log(username);
        activateAdminMode();
    }
    if (username !== null) {
        document.getElementById("start").onclick = startGame;
        document.getElementById("leaderboard").onclick = visitLeaderboard;
        welcomeUser(username);
        setTimeout(displayMainMenu, 1000);
        
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
// document.getElementById("start").onclick = startGame;

// spawnButtons();