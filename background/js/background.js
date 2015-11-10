/**
 * Created by nbugash on 10/11/15.
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var encodedHTTPRequest = request.encodedHTTPRequest;
    if (encodedHTTPRequest) {
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
            /* send message to the Validate.html page */
            chrome.runtime.sendMessage({
                encodedHTTPRequest: encodedHTTPRequest
            }, function(response){
                console.log(response.farewell);
            });
        });
    }
});