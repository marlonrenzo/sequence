function createNewButton(number, xPos, yPos) {
    let div = document.getElementById("gameWindow");
    let btn = document.createElement("button");
    btn.id = "btn" + number;
    btn.className = "sequenceButton"
    btn.onclick = function () { removeButtonAfterClick(btn.id) };
    btn.innerHTML = `<div id="div${number}">${number}</div>`;
    btn.style.position = 'absolute';
    btn.style.marginTop = `${yPos}px`;
    btn.style.marginLeft = `${xPos}px`;
    div.appendChild(btn);
}

function removeButtonAfterClick(id) {
    let clickedNumber = id.match(/\d+/)[0];
    let currentNumber = document.getElementById("currentNumber").innerText;
    console.log(currentNumber);
    if (clickedNumber == currentNumber) {
        currentNumber++;
        document.getElementById("currentNumber").innerText = currentNumber;
        removeButton(id);
    } else {
        wrongButtonClicked(id);
    }
}

function wrongButtonClicked(id) {
    let currentElm = document.getElementById(id);
    currentElm.style.animation = "shake 0.5s";
    document.body.style.backgroundColor = "#734343";

    setTimeout(function() {
        document.body.style.backgroundColor = "#333333";
        document.body.style.transition = "200ms";
        currentElm.style.animation = "none";
    }, 750);
}

function removeButton(id) {
    let div = document.getElementById("gameWindow");
    let currentElm = document.getElementById(id);
    document.getElementById(id).style = `background-color: #333333;
                                         color: #333333;
                                         transition: 1000ms;`;
    setTimeout(function() {
        div.removeChild(currentElm)
    }, 1000);
}

function spawnButtons() {
    let div = document.getElementById("gameWindow");
    let yLimit = div.offsetHeight - 100;
    let xLimit = div.offsetWidth - 100;
    console.log("Y limit:" + yLimit + "\nX limit: " + xLimit);
    for(let num=50; num>=1; num--) {
        let randomX = randomNumber(xLimit);
        let randomY = randomNumber(yLimit);
        createNewButton(num, randomX, randomY);
    }
}

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

// createNewButton(1);
spawnButtons();