/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var blobURL = URL.createObjectURL(new Blob(['(',
    function () {
        function buildHTTPRequestCall(data) {
            var endpoint = data.endpoint;
            var http = new XMLHttpRequest();
            if (data.method === "GET") {
                http.open("GET", endpoint, true);
                http.send();
            }
            else if (data.method === "POST") {
                http.open("POST", endpoint, true);
                http.setRequestHeader("Content-type", "application/json");
                http.send(JSON.stringify(data.payload));
            }
        }
        onmessage = function (e) {
            var message = e.data;
            buildHTTPRequestCall(message);
        };
    }.toString(),
    ')()'], { type: 'application/javascript' }));
try {
    window["sa"] = (function (window) {
        'use strict';
        // user config
        var config = { tracking_id: null, user_id: null };
        var CookieAlias = {
            user_id: '_saID'
        };
        var endpoint = "http://localhost/api";
        var url = endpoint + "/analytic/";
        var healthcheck = endpoint + "/healthcheck/";
        var worker = new Worker(blobURL);
        var serviceOnline = true;
        // Init config
        var init = function (trackingID) {
            serviceOnline = healthCheck();
            if (serviceOnline) {
                config.tracking_id = trackingID;
                // gen user_id and setCookie when cookie does not exist
                config.user_id = getCookie(CookieAlias.user_id);
                if (!config.user_id) {
                    config.user_id = createUserID(trackingID);
                    setCookie(CookieAlias.user_id, config.user_id, 30);
                }
                // worker.onmessage = e => {
                //   const message = e.data
                //   console.log("STATUS: "+message)
                // }
            }
            else {
                console.log("FAILED TO CALL ANALYTIC SERVER");
            }
        };
        // config: {
        // pageView: true,
        // pageHit: true,
        // }
        var preSettings = function (params) {
            Object.entries(params).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                if (value) {
                    var payload = {
                        event_name: key,
                        value: {}
                    };
                    send(payload);
                }
            });
        };
        var send = function (data) {
            if (!serviceOnline) {
                console.log("Analytic system are currently not working!");
                return;
            }
            data.tracking_id = config.tracking_id;
            data.user_id = config.user_id;
            // setTimeout(() => worker.postMessage(data), 5000);
            //send job to worker
            var wrapper = {
                "method": "POST",
                "endpoint": url,
                "payload": data
            };
            worker.postMessage(wrapper);
        };
        var healthCheck = function () {
            var http = new XMLHttpRequest();
            // http.onreadystatechange = function() {
            //     if (this.readyState == 4 && this.status == 200) {
            //         console.log(this.responseText);
            //     }
            // };
            http.open("GET", healthcheck, false);
            http.send();
            return http.status === 200;
        };
        // create user ID from tracking ID
        var createUserID = function (trackingID) {
            var randomStr = Math.random().toString(36).substr(2, 5);
            var uniqueID = trackingID + '.' + dateTimeFormat(new Date()) + '.' + randomStr;
            return btoa(uniqueID);
        };
        // append 0 front when n<10
        var pad2 = function (n) {
            return n < 10 ? '0' + n : n;
        };
        // gen datetime format "YYYYMMDDHHMMSS"
        var dateTimeFormat = function (date) {
            return date.getFullYear().toString() + pad2(date.getMonth() + 1)
                + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes())
                + pad2(date.getSeconds());
        };
        // Set a Cookie
        var setCookie = function (cName, cValue, expDays) {
            var date = new Date();
            date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + date.toUTCString();
            document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
        };
        // get Cookie
        var getCookie = function (cName) {
            var name = cName + "=";
            var cDecoded = decodeURIComponent(document.cookie); //to be careful
            var cArr = cDecoded.split('; ');
            var res;
            cArr.forEach(function (val) {
                if (val.indexOf(name) === 0)
                    res = val.substring(name.length);
            });
            return res;
        };
        return {
            init: init,
            config: config,
            send: send,
            preSettings: preSettings,
        };
    })(window);
    // eslint-disable-next-line no-empty
}
catch (_a) {
}
