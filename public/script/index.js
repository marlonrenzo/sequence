var url = "https://diyarsalamatravandi/sequence/v1";

function checkExistence(username) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + `/users/${username}`, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.responseText);
            if (result[0]['exists'] === 1) {
                login(username)
            } else {
                signUp(username)
            }
            
        }
    }
}

function login(username) {
    return;
}

function signUp(username) {
    return;
}