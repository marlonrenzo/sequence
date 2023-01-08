const url = "https://sequence.marlonfajardo.ca/server/v2";
var gameUrl = "https://sequence.marlonfajardo.ca";

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
        window.location.replace(gameUrl);
    } else {
        alert("Sorry, your browser is too out of date to play Sequence.");
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
        window.location.replace("https://sequence.marlonfajardo.ca");
    } else {
        document.getElementById("loginBlock").style.display = "flex";
    }
}

function fixMobileSizing() {
    if (window.innerWidth <= 620) {
        let vh = window.innerHeight * 0.01;
        document.body.style.setProperty('--vh', `${vh}px`);
    }
}

function authenticate() {
    document.getElementById("loginBtn").onclick = "";
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + `/users/authenticate/${username}/${password}`, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText)[0];
            if (result['result'] === 1) {
                login(username);
            } else {
                alert("Incorrect credentials, try again");
                document.getElementById("loginBtn").onclick = function () {
                    authenticate();
                }
            }
        }
    }
}

function activateLoginButton() {
    let username = (document.getElementById("username").value).toLowerCase().trim();
    if (username === "admin") {
        document.getElementById("password").style.display = "inline-block";
        document.getElementById("loginBtn").onclick = function () {
            authenticate();
        }
    } else if (username !== "" || username.length < 13) {
        checkExistence(username);
    } else {
        alert("Please enter a username that is 1-12 characters in length");
    }
    return false;
}

fixMobileSizing();
checkIfLoggedIn();
