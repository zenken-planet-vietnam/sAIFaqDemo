/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const blobURL = URL.createObjectURL(new Blob(['(',
    function () {
        function buildHTTPRequestCall(data: any) {
            let endpoint: string = data.endpoint
            let http = new XMLHttpRequest()

            if (data.method === "GET") {
                http.open("GET", endpoint, true)
                http.send()

            } else if (data.method === "POST") {
                http.open("POST", endpoint, true)
                http.setRequestHeader("Content-type", "application/json")

                http.send(JSON.stringify(data.payload))
            }
        }

        onmessage = (e) => {
            const message = e.data;
            buildHTTPRequestCall(message)
        };

    }.toString(),

    ')()'], {type: 'application/javascript'}));


try {
    window["sa"] = (function (window) {
        'use strict';
        // user config
        let config= {tracking_id: null, user_id: null}
        const CookieAlias = {
            user_id: '_saID'
        }
        const endpoint: string = "http://localhost/api"
        const url: string = endpoint + "/analytic/"
        const healthcheck: string = endpoint + "/healthcheck/"
        const worker = new Worker(blobURL)
        let serviceOnline: boolean = true;
        // Init config
        const init = (trackingID: string): void => {
            serviceOnline = healthCheck()
            if (serviceOnline) {
                config.tracking_id = trackingID
                // gen user_id and setCookie when cookie does not exist
                config.user_id = getCookie(CookieAlias.user_id)
                if (!config.user_id) {
                    config.user_id = createUserID(trackingID)
                    setCookie(CookieAlias.user_id, config.user_id, 30)
                }
                // worker.onmessage = e => {
                //   const message = e.data
                //   console.log("STATUS: "+message)
                // }
            } else {
                console.log("FAILED TO CALL ANALYTIC SERVER")
            }
        };

        // config: {
        // pageView: true,
        // pageHit: true,
        // }
        const preSettings = (params: object): void => {
            Object.entries(params).forEach(([key, value]) => {
                if(value) {
                    let payload = {
                        event_name: key,
                        value: {}
                    }
                    send(payload)
                }
            })
        }

        const send = (data: any): void => {
            if(!serviceOnline) {
                console.log("Analytic system are currently not working!")
                return
            }

            data.tracking_id = config.tracking_id
            data.user_id = config.user_id
            // setTimeout(() => worker.postMessage(data), 5000);
            //send job to worker
            let wrapper: object = {
                "method": "POST",
                "endpoint": url,
                "payload": data
            }
            worker.postMessage(wrapper)
        }
        const healthCheck = (): boolean => {
            let http = new XMLHttpRequest()

            // http.onreadystatechange = function() {
            //     if (this.readyState == 4 && this.status == 200) {
            //         console.log(this.responseText);
            //     }
            // };
            http.open("GET", healthcheck, false)
            http.send()
            return http.status === 200;
        }
        // create user ID from tracking ID
        const createUserID = (trackingID: string): string => {
            let randomStr: string = Math.random().toString(36).substr(2, 5);
            let uniqueID: string = trackingID + '.' + dateTimeFormat(new Date()) + '.' + randomStr
            return btoa(uniqueID)
        }

        // append 0 front when n<10
        const pad2 = (n: number): number | string => {
            return n < 10 ? '0' + n : n
        }

        // gen datetime format "YYYYMMDDHHMMSS"
        const dateTimeFormat = (date: Date): string => {
            return date.getFullYear().toString() + pad2(date.getMonth() + 1)
                + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes())
                + pad2(date.getSeconds())
        }
        // Set a Cookie
        const setCookie = (cName: string, cValue: string, expDays: number): void => {
            let date = new Date();
            date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
        }
        // get Cookie
        const getCookie = (cName: string): string => {
            const name: string = cName + "=";
            const cDecoded = decodeURIComponent(document.cookie); //to be careful
            const cArr = cDecoded.split('; ');
            let res: string;
            cArr.forEach(val => {
                if (val.indexOf(name) === 0) res = val.substring(name.length);
            })
            return res;
        }

        return {
            init: init,
            config: config,
            send: send,
            preSettings: preSettings,
        }

    })(window);
    // eslint-disable-next-line no-empty
} catch {

}
