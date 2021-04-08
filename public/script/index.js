var url = "https://diyarsalamatravandi.ca/sequence/v1";
var currentUrl = "https://marlonfajardo.ca/sequence";

function checkExistence(username) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + `/users/${username}`, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.responseText);
            if (result[0]['user_exists'] === 1) {
                console.log("Hello, " + username);
                login(username);
            } else {
                console.log("yo who tf u is");
                signUp(username)
            }
            
        }
    }
}

function login(username) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("username", username);
        window.location.replace(currentUrl + "/game");
    } else {
        console.log("You browser doesn't support storage");
    }
}

function signUp(username) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", url + `/users/${username}`, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.responseText)[0];
            console.log(result);
            if (result[0]['ROW_COUNT()'] === 1) {
                console.log("Hello, " + username);
                login(username);
            } else {
                console.log("Unable to add you to the database");
            }
        }
    }
}

function checkIfLoggedIn() {
    if (localStorage.getItem("username") !== null) {
        window.location.replace("https://marlonfajardo.ca/sequence/game");
    }
}

function fixMobileSizing() {
    if (window.innerWidth <= 620) {
        let vh = window.innerHeight * 0.01;
        document.body.style.setProperty('--vh', `${vh}px`);
    }
}

fixMobileSizing();
checkIfLoggedIn();
document.getElementById("loginBtn").onclick = function () {
    let username = document.getElementById("login").value;
    console.log(username);
    if (username !== "" || username.length < 30) {
        checkExistence(username);
    } else {
        alert("Please enter a username that's under 30 characters");
    }
}