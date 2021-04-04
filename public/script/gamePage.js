function createNewButton(number) {
    let div = document.getElementById("gameWindow");
    let btn = document.createElement("button");
    btn.id = "btn" + number;
    btn.className = "sequenceButton"
    btn.onclick = function () { removeButtonAfterClick(btn.id) };
    btn.innerHTML = `<div id="div${number}">${number}</div>`;
    // btn.style.position = 'relative';
    // btn.style.marginTop = '400px';
    // btn.style.marginLeft = '400px';
    div.appendChild(btn);
}

function removeButtonAfterClick(id) {
    console.log("removing" + id);
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
    btn.style.position = 'absolute';
    for(let i=10; i>=1; i--) {
        console.log(i);
    }
}

createNewButton(1);