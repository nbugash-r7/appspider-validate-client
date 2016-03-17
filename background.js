/**
 * Created by nbugash on 12/01/16.
 */

var current_step;
/* Coming from the Content.js */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    switch (message.from.toLocaleLowerCase()) {
        case "content.js":
            switch (message.type) {
                case "run_validate_page":
                    var encodedhttp = message.data.encodedHTTPRequest;
                    var storage_type = message.data.storage_type;

                    /*(1) Clearing chrome storage */
                    switch(storage_type) {
                        case "local":
                            chrome.storage.local.clear(function(){
                                console.log("Clearing chrome local storage");
                                /* (2) Decode http request */
                                var decodedhttprequest = appspider.http.decodeRequest(encodedhttp);
                                /* (3) Split the decoded http request into an array of requests */
                                var requests = _.compact(appspider.http.splitRequests(decodedhttprequest));
                                /* (4) For each request in the request array, parse into
                                 * a. attack request header
                                 * b. attack request payload
                                 * c. attack description
                                 * d. attack response header
                                 * e. attack response content
                                 * */
                                var step = 1;
                                var parsed_attacked = [];
                                for (var index = 0; index < requests.length; index++ ) {
                                    if (_.size(requests[index])!= 0 ){
                                        (function(){
                                            /* attack now has headers, payload, description */
                                            var attack = appspider.http.splitRequest(requests[index]);
                                            /* setting the attack id */
                                            attack.id = step;
                                            /* converting headers from String to JSON object */
                                            attack.request.headers = appspider.util.convertHeaderStringToJSON(attack.request.headers);
                                            switch (message.data.send_request_as) {
                                                case 'xmlhttprequest':
                                                    appspider.http.send.viaXHR(attack,
                                                        function (xhr) {
                                                            /* On a successful response */
                                                            attack.response.headers = appspider.util.convertHeaderStringToJSON(xhr.getAllResponseHeaders());
                                                            attack.response.content = xhr.responseText;
                                                            /* Save attack to chrome storage */
                                                            appspider.chrome.storage.local.saveAttack(attack, function () {
                                                                parsed_attacked.push(attack.id);
                                                                console.log('Attack id: ' + attack.id + ' saved!');
                                                                if (parsed_attacked.length === requests.length) {
                                                                    appspider.chrome.window.open('plugin.html', 940, 745);
                                                                }
                                                            });
                                                        },
                                                        function (error) {
                                                            /* On an error response */
                                                            console.error('Background.js: ' + xhr.status + ' ' +
                                                                'error status ' + error.status + ' for attack id: ' +
                                                                attack.id);
                                                        }
                                                    );
                                                    break;
                                                case 'ajax':
                                                    console.log('Sending http request via ajax is not yet implemented');
                                                    break;
                                                default:
                                                    console.error('Error: Unable to verify method of sending data!');
                                                    break;
                                            }

                                        })();
                                        step++;
                                    }
                                }
                            });
                            break;
                        case "sync":
                            chrome.storage.sync.clear();
                            console.log("Clearing chrome sync storage");
                            break;
                        default:
                            console.error("Background.js: Unable to determine storage type");
                            break;
                    }

                    break;
                default:
                    break;

            }
            break;
        default:
            console.log("Background.js: Can not handle request from "+ message.from + " script!!");
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
                break;
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
                    console.error("Background.js: Unable to handle message from '" + channel_name + "'")
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
            var headers = details.requestHeaders;
            var map = {};
            var new_headers = [];
            for( var index = 0; index < headers.length; index++) {
                if(!headers[index].name.match(new RegExp(AppSpider.TOKEN))){
                    map[headers[index].name] = headers[index].value;
                }
            }
            for( index = 0; index < headers.length; index++) {
                if(headers[index].name.match(new RegExp(AppSpider.TOKEN))){
                    //slice the name
                    var name = headers[index].name.slice(AppSpider.TOKEN.length);
                    map[name] = headers[index].value;
                }
            }
            for(var key in map) {
                new_headers.push({
                    name: key,
                    value: map[key]
                });
                headers = new_headers;
            }

        } catch(err) {
            //console.log(err);
        }
        return {requestHeaders: headers};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]);
