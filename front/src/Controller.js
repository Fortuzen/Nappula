// Request points or new id from the server
const fetchRequest = () => {
    console.log("fetch Score");
    const token = getToken();
    const url = "/requestPoints";

    const request = fetch(url, {
            method: 'POST', mode: "cors", credentials: "same-origin",
            headers: {
            "Authorization": "Bearer " + token,
            "Content-Type" : "application/json"}
        ,}).then((res) => {
            return res.json();
        });
    return request.then((data)=>{
        //console.log(data);
        setToken(data.token);
        //console.log(getToken());
        return data;
    });
}

// Send a point spending request to the server
const fetchSpend = () => {
    console.log("fetchSpend");
    const token = getToken();
    //console.log(token);
    const url = "/spendPoints";
    const request = fetch(url, {
            method: 'POST', mode: "cors", credentials: "same-origin",
            headers: {
            "Authorization": "Bearer "+token,
            "Content-Type" : "application/json"},
        }).then((res) => {
            return res.json();
        });
    return request.then((data)=>{
        //console.log(data);
        // If there is a token, then it means the user was issued a new id.
        if(data.token) {
            setToken(data.token);
            data.pointsWon = 0;
            data.pointsToNextWin = 0;
        }
        return data;
    });  
}

// Reset request for game over
const fetchReset = () => {
    console.log("Fetch reset");
    setToken("");
    return fetchRequest();
}

function setToken(token) {
    window.localStorage.token = token;
}

function getToken() {
    return window.localStorage.token;
}


export default { fetchRequest, fetchSpend, fetchReset }