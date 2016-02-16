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
                                var decodedhttprequest = AppSpider.http.decodeRequest(encodedhttp);
                                /* (3) Split the decoded http request into an array of requests */
                                var requests = _.compact(AppSpider.http.splitRequests(decodedhttprequest));
                                /* (4) For each request in the request array, parse into
                                 * a. attack request header
                                 * b. attack request payload
                                 * c. attack description
                                 * d. attack response header
                                 * e. attack response content
                                 * */
                                var step = 1;
                                for (var index = 0; index < requests.length; index++ ) {
                                    if (_.size(requests[index])!= 0 ){
                                        var attack = AppSpider.http.splitRequest(requests[index]);
                                        attack.id = step;
                                        attack.headers = AppSpider.helper.convertHeaderStringToJSON(attack.headers);
                                        /* Save attack to chrome.storage.local */
                                        (function(){
                                            var attack_obj = {};
                                            attack_obj[step] = attack;
                                            chrome.storage.local.set(attack_obj, function(){
                                                var key = Object.keys(attack_obj)[0];
                                                console.log("Save attack id: " + key + " with just http request!");
                                                switch (message.data.send_request_as) {
                                                    case 'xmlhttprequest':
                                                        /* Use xmlhttprequest to send the attack */
                                                        AppSpider.http.sendAttackUsingXMLHTTPRequest(key, attack_obj[key],
                                                            function(xhr) {
                                                                attack_obj[key].response_headers = xhr.getAllResponseHeaders();
                                                                attack_obj[key].response_content = xhr.responseText;
                                                                chrome.storage.local.set(attack_obj, function () {
                                                                    console.log("Saving attack id: " + key +
                                                                        " to local storage with http response!!");
                                                                });
                                                            },
                                                            function(err){
                                                                console.error("Background.js: xhr.status: "+ err.status
                                                                    + " for attack id: " + key);

                                                            });
                                                        break;
                                                    case 'ajax':
                                                        /* Use ajax request to send the attack */
                                                        AppSpider.http.sendAttackUsingAJAX(key,attack_obj[key],
                                                            function(data, text_status, jqXHR){ // Success
                                                                console.log("Receive http response for attack id: " + key);
                                                                attack_obj[key].response_headers = jqXHR.getAllResponseHeaders();
                                                                attack_obj[key].response_content = data.responseText;
                                                                chrome.storage.local.set(attack_obj, function(){
                                                                    console.log("Saving attack id: "+ key +
                                                                        " to local storage with http response!!");
                                                                });
                                                            },function(jqXHR, textStatus, errorThrown){ // fail
                                                                console.error(textStatus + " Unable to send ajax request with message '" +
                                                                    errorThrown + "'")
                                                            }, function(data, text_status, jqXHR){ //always
                                                                console.log("Ajax completed!!");
                                                            });
                                                        break;
                                                    default:
                                                        console.error("Background.js: Unknown request type! " +
                                                            "Use either 'xmlhttprequest' or 'ajax'");
                                                        break;
                                                }
                                            });
                                        })();
                                        step++;
                                        chrome.storage.local.get(null, function(attacks){
                                            if(_.size(attacks) >= requests.length){
                                                AppSpider.chrome.openNewWindow('validate.html', 940, 745);
                                            }
                                        });

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
