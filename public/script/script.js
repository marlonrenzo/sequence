function createNewButton(number) {
    let div = document.getElementById("gameWindow");
    let btn = document.createElement("button");
    btn.id = "btn" + number;
    btn.className = "sequenceButton"
    btn.onclick = function () { removeButtonAfterClick(btn.id) };
    btn.innerHTML = `<div id="div${number}">${number}</div>`;
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

createNewButton(1);