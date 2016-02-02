/**
 * Created by nbugash on 12/01/16.
 */

/* GLOBAL VARIABLE*/
var encodedHTTPRequest;
var restrictedChromeHeaders = [
    "ACCEPT-CHARSET",
    "ACCEPT-ENCODING",
    "ACCESS-CONTROL-REQUEST-HEADERS",
    "ACCESS-CONTROL-REQUEST-METHOD",
    "CONTENT-LENGTHNECTION",
    "CONTENT-LENGTH",
    "COOKIE",
    "CONTENT-TRANSFER-ENCODING",
    "DATE",
    "EXPECT",
    "HOST",
    "KEEP-ALIVE",
    "ORIGIN",
    "REFERER",
    "TE",
    "TRAILER",
    "TRANSFER-ENCODING",
    "UPGRADE",
    "USER-AGENT",
    "VIA"
];
var global_headers;

var current_step;
/* Helper functions */
var httpFunctions = {
    decodeRequest: function (encodedRequest) {
        return window.atob(encodedRequest);
    },

    /* Split the decoded request to multiple requests*/
    splitRequests: function (decodedRequests) {
        var requests = decodedRequests.split(/(#H#G#F#E#D#C#B#A#)/);
        for (var i = 0; i < requests.length; i++) {
            if (requests[i].match(/(#H#G#F#E#D#C#B#A#)/)) {
                delete requests[i];
            }
        }
        return requests;
    },

    /* Split the request to header, payload, and description */
    splitRequest: function (request) {
        var array = request.split(/(A#B#C#D#E#F#G#H#)/);
        var header_payload = array[0];
        return {
            headers: header_payload.split('\r\n\r\n')[0].trim(),
            payload: header_payload.split('\r\n\r\n')[1].trim(),
            description: array[2].trim(),
            response_headers: {},
            response_content: {}
        }
    },

    convertHeaderStringToJSON: function (headerString) {
        var headerArray = headerString.split("\r\n");
        var headers = {};
        for (var i = 0; i < headerArray.length; i++) {
            if (headerArray[i].toUpperCase().match(/GET|POST|PUT|DELETE/)) {
                var requestArray = headerArray[i].split(" ");
                headers.REQUEST = {
                    method: requestArray[0],
                    uri: requestArray[1],
                    version: requestArray[2]
                };
            } else if (headerArray[i].indexOf(":") > -1) {
                var a = headerArray[i].split(":");
                var header_name = a[0].trim();
                switch(header_name) {
                    case "Referer":
                        headers[header_name] = a.slice(1).join(":").trim();
                        break;
                    case "Cookie":
                        var cookiearray = a[a.length - 1].split(';');
                        var cookieValues = {};
                        for (var x = 0; x < cookiearray.length; x++) {
                            if (cookiearray[x].indexOf("=") > -1) {
                                var array = cookiearray[x].split("=");
                                cookieValues[array[0].trim()] = array[array.length -1].trim();
                            }
                        }
                        headers[header_name] = cookieValues;
                        break;
                    default:
                        headers[header_name] = a[a.length - 1].trim();
                        break;
                }
            }
        }
        return headers;
    }

};

/* Coming from the Content.js */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    switch (request.from) {
        case "content.js":
            switch (request.type) {
                case "open_validate_page":
                    chrome.tabs.create({
                        url: chrome.extension.getURL('../validate.html'),
                        active: false
                    }, function (tab) {
                        // After the tab has been created, open a window to inject the tab
                        chrome.windows.create({
                            tabId: tab.id,
                            type: 'popup',
                            focused: true,
                            width: 940,
                            height: 745
                            // incognito, top, left, ...
                        });
                    });
                    console.log("Opening validate page");
                    break;
                case "save_encoded_http_request":
                    /* Saving the encodedHTTPRequest */
                    encodedHTTPRequest = request.data.encodedHTTPRequest;
                    console.log("Saving encoded http request");
                    break;
                case "parse_and_save_http_request":
                    /*
                     * (1) Decode request to header, payload, and description
                     * (2) Split request to global_headers and payload
                     * (3) Convert header to json object
                     * (4) Save JSON header, Payload, and Description
                     * */

                    /* (1) Decode request */
                    var decodedRequests = httpFunctions.decodeRequest(encodedHTTPRequest);
                    var requests = httpFunctions.splitRequests(decodedRequests);

                    /* (2) For each requests, split into global_headers and payload */
                    var step = 1;
                    for (var i = 0; i < requests.length; i++) {
                        /* For each defined element */
                        if (requests[i]) {
                            var request = httpFunctions.splitRequest(requests[i]);
                            /* (3) Convert header to JSON Object */
                            request.headers = httpFunctions.convertHeaderStringToJSON(request.headers);
                            /* (4) Save request as with step being the key */
                            var attack_obj = {};
                            attack_obj[step] = request;
                            chrome.storage.local.set(attack_obj, function () {
                                console.log("Request save to key: '" + step + "'");
                            });
                            step++;
                        }
                    }
                    console.log("http request saved! Clearing encoded http request");
                    encodedHTTPRequest = null;
                    break;
                default:
                    break;
            }
            break;
        default:
            console.log("Background.js: Can not handle request from "+ request.from + " script!!");
            break;
    }
});

chrome.runtime.onConnect.addListener(function(channel) {
    var channel_name = channel.name;
    try {
        channel.onMessage.addListener(function(message){
            switch(channel_name) {
                case "app.js":
                    switch(message.type) {
                        case "savehttpHeaders":
                            global_headers = message.data.headers;
                            channel.postMessage({
                                from: "Background.js",
                                type: "httpHeaderSaved"
                            });
                            break;
                        case "setCurrentStep":
                            current_step = message.data.current_step;
                            channel.postMessage({
                                from: "Background.js",
                                type: "currentStep"
                            });
                            break;
                        default:
                            console.error("Background.js: Unable to handle " + message.type);
                            break;
                    }
                case "cookieapp.js":
                    switch(message.type) {
                        case "getCurrentStep":
                            channel.postMessage({
                                from: "Background.js",
                                type: "currentStep",
                                data: {
                                    current_step: current_step
                                }
                            });
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        });
    } catch(err) {
        console.error("Background.js: " + err);
    }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        try {
            if (details.url.match(new RegExp(global_headers.Host)) ||
                Object.keys(global_headers).length > 0) {
                var headers = details.requestHeaders;
                var cookie_string = "";


                /* Sanitize Global Headers */
                delete global_headers.REQUEST;
                for (var cookie in global_headers.Cookie) {
                    cookie_string += cookie + "=" + global_headers.Cookie[cookie] + ";"
                }
                global_headers.Cookie = cookie_string;
                for (var header in global_headers) {
                    var found = false;
                    for(var index = 0; index < headers.length && !found; index++) {
                        if (headers[index].name.toLowerCase() === header.toLowerCase()) {
                            console.log("Found a match!!");
                            headers[index].value = global_headers[header];
                            delete global_headers[header];
                            found = true;
                        }
                    }
                    if (!found) {
                        headers.push({
                            name: header,
                            value: global_headers[header]
                        });
                        delete global_headers[header];
                    }
                }
            }
        } catch(err) {
            console.log(err);
        }
        return {requestHeaders: headers};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]);
