/**
 * Created by nbugash on 10/11/15.
 */
/* Global variable */
var encodedHTTPRequest;
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

chrome.runtime.onConnect.addListener(function(channel){
    var name = channel.name;

    if (name == "validate.js"){
        channel.onMessage.addListener(function(message){
            if (message.type == "getEncodedHTTPRequest") {
                channel.postMessage({
                    fromJS: "background.js",
                    type: "encodedHTTPRequest",
                    data: {
                        encodedHTTPRequest: encodedHTTPRequest
                    }
                });
            }
        });
    }
});



