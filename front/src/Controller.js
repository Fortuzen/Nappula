const fetchScore = () => {
    console.log("fetch Score");
    let token = getToken();
    let url = "/requestScore";

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
        console.log(getToken());
        return data;
    });
}

const fetchSpend = () => {
    console.log("fetchSpend");
    let token = getToken();
    console.log(token);
    let url = "/spendScore";
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
        return data;
    });  
}

const fetchReset = () => {
    console.log("Fetch reset");
    setToken("");
    return fetchScore();
}

function setToken(token) {
    window.localStorage.token = token;
}

function getToken() {
    return window.localStorage.token;
}


export default { fetchScore, fetchSpend, fetchReset }