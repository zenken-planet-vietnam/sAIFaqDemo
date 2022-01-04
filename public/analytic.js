/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

try {
    window.sa = (function (window) {
        'use strict';
        // user config
        let config = {}
        const CookieAlias = {
            user_id: '_saID'
        }
        const url = "http://localhost/api/analytic/"
        // Init config 
        const init = (trackingID) => {
            config.tracking_id = trackingID
            // gen user_id and setCookie when cookie does not exist
            config.user_id = getCookie(CookieAlias.user_id)
            if (!config.user_id) {
                config.user_id = createUserID(trackingID)
                setCookie(CookieAlias.user_id, config.user_id, 30)
            }
        };



        const send = (data) => {
            data.tracking_id = config.tracking_id
            data.user_id = config.user_id
            // var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            // navigator.sendBeacon(url, JSON.stringify(data))
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: url,
                data: JSON.stringify(data),
            });
        }

        // create user ID from tracking ID
        const createUserID = (trackingID) => {
            let randomStr = Math.random().toString(36).substr(2, 5);
            let uniqueID = trackingID + '.' + dateTimeFormat(new Date()) + '.' + randomStr
            return btoa(uniqueID)
        }

        // append 0 front when n<10
        function pad2(n) {
            return n < 10 ? '0' + n : n
        }

        // gen datetime format "YYYYMMDDHHMMSS"
        const dateTimeFormat = (date) => {
            return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds())
        }
        // Set a Cookie
        const setCookie = (cName, cValue, expDays) => {
            let date = new Date();
            date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
        }
        // get Cookie
        const getCookie = (cName) => {
            const name = cName + "=";
            const cDecoded = decodeURIComponent(document.cookie); //to be careful
            const cArr = cDecoded.split('; ');
            let res;
            cArr.forEach(val => {
                if (val.indexOf(name) === 0) res = val.substring(name.length);
            })
            return res;
        }

        return {
            init: init,
            config: config,
            send: send
        }

    })(window);
    // eslint-disable-next-line no-empty
} catch {

}

