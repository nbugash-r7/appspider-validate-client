/**
 * Created by nbugash on 10/11/15.
 */
/* Global variable */
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

var headers;

var token = 'appspider-validate-';

/* Comming from the Content.js */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var type = request.type;
    if (type == "encodedHTTPRequest") {
        chrome.tabs.create({
            url: chrome.extension.getURL('../lib/validate.html'),
            active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true
                // incognito, top, left, ...
            });
            /* Saving the encodedHTTPRequest */
            encodedHTTPRequest = request.data.encodedHTTPRequest;
        });
    }
});

/* Coming from the Validate.js */
chrome.runtime.onConnect.addListener(function(channel){
    var name = channel.name;

    if (name == "validate.js"){
        channel.onMessage.addListener(function(message){
            switch (message.type) {
                case 'getEncodedHTTPRequest':
                    channel.postMessage({
                        fromJS: 'background.js',
                        type: 'encodedHTTPRequest',
                        data: {
                            encodedHTTPRequest: encodedHTTPRequest
                        }
                    });
                    break;
                case 'sendRequest':

                    /*
                    * message = {
                    *   'type': 'sendRequest',
                    *   'data': {
                    *       'method': 'GET' or 'POST',
                    *       'url': 'http://webscantest.com',
                    *       'headers': {
                    *           'User-Agent': [valid user agent],
                    *           :
                    *           :
                    *      }
                    *   }
                    * }
                    * */

                    /* httpRequest = {
                    *   'method': 'GET' or 'POST',
                    *   'url': 'http://webscantest.com',
                    *   'headers': {
                    *       'User-Agent': [valid user agent],
                    *       :
                    *       :
                    *   }
                    * }
                    * */
                    var httpRequest = message.data;
                    var xhr = new XMLHttpRequest();
                    headers = {};
                    xhr.onreadystatechange = function(){
                        if (xhr.readyState == 4 && xhr.status == 200){
                            channel.postMessage({
                                type: 'httpresponse',
                                data: xhr.responseText
                            });
                        }
                    };
                    xhr.open(httpRequest['method'], httpRequest['url'], true);
                    for (var header in httpRequest.headers) {
                        header = header.toUpperCase();
                        if (restrictedChromeHeaders.indexOf(header) > -1){
                            xhr.setRequestHeader(token + header, httpRequest.headers[header] );
                            headers[token + header] = httpRequest.headers[header];
                        } else {
                            xhr.setRequestHeader(header, httpRequest.headers[header] );
                            headers[header] = httpRequest.headers[header];
                        }
                    }
                    xhr.send(' ');
            }
        });
    }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name.match(/appsider-validate/i)){
                var name = details.requestHeaders[i].name;
                name = name.slice(token.length);
                details.requestHeaders[i].name = name;
                details.requestHeaders[i].value = headers[name];
            }
        }
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]);


//chrome.webRequest.onBeforeSendHeaders.addListener(
//    function(details) {
//        for (var i = 0; i < details.requestHeaders.length; ++i) {
//            if (details.requestHeaders[i].name === 'User-Agent') {
//                details.requestHeaders.splice(i, 1);
//                break;
//            }
//        }
//        return {requestHeaders: details.requestHeaders};
//    },
//    {urls: ["<all_urls>"]},
//    ["blocking", "requestHeaders"]);