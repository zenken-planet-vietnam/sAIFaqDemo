function buildHTTPRequestCall(data) {
    let endpoint = data.endpoint
    let http = new XMLHttpRequest()

    if (data.method === "GET") {
        http.open("GET", endpoint, true)
        http.send()

    }else if(data.method === "POST") {
        http.open("POST", endpoint, true)
        http.setRequestHeader("Content-type", "application/json")

        http.send(JSON.stringify(data.payload))
    }
}

onmessage = (e) => {
    const message = e.data;
    buildHTTPRequestCall(message)
};
