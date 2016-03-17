/**
 * Created by nbugash on 14/01/16.
 */


var AppSpider = {
    TOKEN: 'appspider-',
    chrome: {
        store: function (id, obj) {
            var object = {};
            object[id] = obj;
            chrome.storage.local.set(object, function () {
                console.log('Object ' + id + ' was saved to the chrome.storage.local');
                return true;
            });
        },
        retrieve: function ($scope, id, callback) {
            chrome.storage.local.get(id, function (result) {
                console.log('Attack ' + id + ' loaded!!');
                $scope.$apply(function(){
                    callback(result[id]);
                });
            });
        },
        retrieveAll: function ($scope, callback) {
            chrome.storage.local.get(null, function(results){
                console.log('All attacks were retrieved!!');
                $scope.$apply(function(){
                    callback(results);
                });
            });
        },

        /* Parameters:
         * (1) html page
         * (2) width
         * (3) height*/
        openNewWindow: function(htmlpage, width, height) {
            chrome.tabs.create({
                url: chrome.extension.getURL('../'+ htmlpage),
                active: false
            }, function (tab) {
                // After the tab has been created, open a window to inject the tab
                chrome.windows.create({
                    tabId: tab.id,
                    type: 'popup',
                    focused: true,
                    width: width,
                    height: height
                    // incognito, top, left, ...
                });
            });
            console.log('Opening validate page');
        },
        RESTRICTED_CHROME_HEADERS: [
            'ACCEPT-CHARSET',
            'ACCEPT-ENCODING',
            'ACCESS-CONTROL-REQUEST-HEADERS',
            'ACCESS-CONTROL-REQUEST-METHOD',
            'CONNECTION',
            'CONTENT-LENGTH',
            'COOKIE',
            'COOKIE 2',
            'CONTENT-TRANSFER-ENCODING',
            'DATE',
            'EXPECT',
            'HOST',
            'KEEP-ALIVE',
            'ORIGIN',
            'REFERER',
            'TE',
            'TRAILER',
            'TRANSFER-ENCODING',
            'UPGRADE',
            'USER-AGENT',
            'VIA'
        ]

    },
    attack: {
        save: function(attack_id, attack_obj){
            return AppSpider.chrome.store(attack_id,attack_obj);
        },
        load: function($scope, attack_id, callback){
            AppSpider.chrome.retrieve($scope, attack_id,callback);
        },
        update: function($scope, attack_id, attack_key, attack_value) {
            AppSpider.chrome.retrieve($scope, attack_id, function(attack) {
                attack[attack_key] = attack_value;
                AppSpider.attack.save(attack_id,attack);
            });
        }
    },
    attacks: {
        getAllAttacks: function ($scope, callback) {
            AppSpider.chrome.retrieveAll($scope, callback);
        }
    },
    request: {
        send: function(protocol, attack_id, callback) {
            /* Loading attack... */
            AppSpider.attack.load(attack_id, function(attack) {
                var data = {};

                /* http_request_type: GET, POST, DELETE, PUT */
                var http_request = attack.headers.REQUEST.split(' ');
                data.http_request_type = http_request[0].trim();
                data.url = protocol.toLowerCase() + '://' + attack.headers.Host + http_request[1];
                data.http_version = http_request[2];

                /* Setting up the attack */
                delete attack.headers.REQUEST;
                data.headers = attack.headers;
                if (attack.payload) {
                    data.payload = attack.payload;
                }

                /* Sending the message...*/
                var channel = chrome.runtime.connect({name: 'appspider.js'});
                channel.postMessage({
                    type: 'send_request',
                    data: data
                });

                /* Wait for asynchronous callback */
                channel.onMessage.addListener(function(message, sender) {
                    switch(message.type) {
                        case 'http_response':
                            console.log('appspider.js: Receive http response!!');
                            callback(message.data);
                            break;
                        default:
                            console.log('appspider.js: Unable to handle message from ' + message.from);
                            break;
                    }
                });

            });
        }
    },
    helper: {
        convertHeaderStringToJSON: function (headerString) {
            var headerArray = headerString.split('\r\n');
            var headers = {};
            for (var i = 0; i < headerArray.length; i++) {
                if (headerArray[i].toUpperCase().match(/(^GET|^POST|^PUT|^DELETE)/)) {
                    var requestArray = headerArray[i].split(' ');
                    headers.REQUEST = {
                        method: requestArray[0],
                        uri: requestArray[1],
                        version: requestArray[2]
                    };
                } else if (headerArray[i].indexOf(':') > -1) {
                    var a = headerArray[i].split(':');
                    var header_name = a[0].trim();
                    switch(header_name) {
                        case 'Referer':
                            headers.Referer = a.slice(1).join(':').trim();
                            break;
                        case 'Cookie':
                            var cookiearray = a[a.length - 1].split(';');
                            var cookieValues = {};
                            for (var x = 0; x < cookiearray.length; x++) {
                                if (cookiearray[x].indexOf('=') > -1) {
                                    var array = cookiearray[x].split('=');
                                    cookieValues[array[0].trim()] = array[array.length -1].trim();
                                }
                            }
                            headers.Cookie = cookieValues;
                            break;
                        default:
                            headers[header_name] = a[a.length - 1].trim();
                            break;
                    }
                }
            }
            return headers;
        },

        convertJSONToString: function(jsonObj) {
            var str = '';
            if (jsonObj.REQUEST) {
                str = jsonObj.REQUEST.method + ' ' + jsonObj.REQUEST.uri + ' ' + jsonObj.REQUEST.version + '\r\n';
            }
            for (var key in jsonObj) {
                switch(key){
                    case 'REQUEST':
                        break; //skip
                    case 'Cookie':
                        str += key +': ' + JSON.stringify(jsonObj[key], null, '\t') + '\r\n';
                        break;
                    default:
                        if (typeof jsonObj[key] === 'object') {
                            str += key + ': ' + AppSpider.helper.convertJSONToString(jsonObj[key]);
                        } else {
                            str += key + ': ' + jsonObj[key].trim() + '\r\n';
                        }
                        break;
                }
            }
            return str;
        }
    },
    http: {
        /* Send the request using JQuery and Ajax
         *  Obtain the response */
        sendAttackUsingAJAX: function(attack_id, attack, success, error, always) {
            console.log('Sending attack using JQuery-Ajax!!');
            var headers = AppSpider.http.modifyHeaders(attack.headers);
            /* Using JQuery Ajax Calls */
            $.ajax({
                type: attack.headers.REQUEST.method,
                url: 'http://' + attack.headers.Host + attack.headers.REQUEST.uri,
                data: attack.payload,
                beforeSend: function(xhr){
                    console.log('Setting request headers for attack id: ' + attack_id);
                    for (var h in headers) {
                        if(headers.hasOwnProperty(h)){
                            xhr.setRequestHeader(h, headers[h]);
                        }
                    }
                    console.log('Done customizing request headers!!');
                    console.log('Sending attack id: ' + attack_id + ' using ' +
                        attack.headers.REQUEST.method + ' in AJAX');
                },
                done: function (data, text_status, jqXHR) {
                    console.log('Ajax done!!!!!');
                    success(data, text_status, jqXHR);
                },
                fail: function(jqXHR, textStatus, errorThrown) {
                    console.error('Ajax failed!!!!!');
                    error(jqXHR, textStatus, errorThrown);
                },
                always: function(data, text_status, jqXHR) {
                    console.log('Ajax always !!!!!');
                    always(data, text_status, jqXHR);
                }
            });
        },
        /* Send the request using XMLHTTPRequest
         *  Obtain the response */
        sendAttackUsingXMLHTTPRequest: function(attack_id, attack, success, error) {
            console.log('Sending attack id: ' + attack_id + ' using XMLHTTPRequest!!');

            /* Using XMLHttpRequest */
            var xhr = new XMLHttpRequest();
            xhr.open(
                attack.headers.REQUEST.method,
                'http://' + attack.headers.Host + attack.headers.REQUEST.uri,
                true
            );
            console.log('Customizing http request headers for attack id: ' + attack_id);
            var headers = AppSpider.http.modifyHeaders(attack.headers);
            for (var h in headers) {
                if(headers.hasOwnProperty(h)){
                    xhr.setRequestHeader(h, headers[h]);
                }
            }
            console.log('Done setting custom headers!.');
            xhr.onreadystatechange = function(){
                if (xhr.status === 200) {
                    switch(xhr.readyState) {
                        case 0:
                            console.log('Request not yet initialized');
                            break;
                        case 1:
                            console.log('Server connection established.');
                            break;
                        case 2:
                            console.log('Request received');
                            break;
                        case 3:
                            console.log('Processing request');
                            break;
                        case 4:
                            console.log('Request finished and response is ready');
                            console.log('Receiving http response for attack id: ' + attack_id +
                                ' with readyState: ' + xhr.readyState + ' and status of ' + xhr.status);
                            success(xhr);
                            break;
                        default:
                            error(xhr);
                            console.error('Background.js: xhr.status: '+ xhr.status +
                              ' xhr.readyState: ' + xhr.readyState +
                              ' for attack id: ' + attack_id);
                            break;

                    }
                } else {
                    console.log('Background.js - ' + xhr.status + ': Page not found');
                }
            };

            switch(attack.headers.REQUEST.method.toUpperCase()) {
                case 'GET':
                    console.log('Sending request using GET XMLHTTPRequest');
                    xhr.send();
                    break;
                case 'POST':
                    console.log('Sending request using POST XMLHTTPRequest');
                    xhr.send(attack.payload);
                    break;
                default:
                    console.error('Background.js: Unable to send request');
                    break;
            }
        },

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
        /* Split the request to header, payload, description,
           response header, and response content */
        splitRequest: function (request) {
            if(_.size(request) !== 0) {
                var array = request.split(/(A#B#C#D#E#F#G#H#)/);
                var header_payload = array[0];
                return {
                    headers: header_payload.split('\r\n\r\n')[0].trim(),
                    payload: header_payload.split('\r\n\r\n')[1].trim(),
                    description: array[2].trim(),
                    response_headers: 'Waiting for attack response....(click the ' +
                    'Send request button if response is taking a while)',
                    response_content: ''
                };
            }


        },
        /* Allow restricted header in being altered */
        modifyHeaders: function(attack_headers) {
            var headers = {};
            switch(typeof attack_headers) {
                case 'object':
                    for(var header in attack_headers){
                        if (attack_headers.hasOwnProperty(header)){
                            if(_.contains(AppSpider.chrome.RESTRICTED_CHROME_HEADERS, header.toLocaleUpperCase())){
                                switch(header){
                                    case 'Cookie':
                                        var cookie_str = '';
                                        for(var key in attack_headers.Cookie) {
                                            if(attack_headers.Cookie.hasOwnProperty(key)){
                                                cookie_str += key + '=' + attack_headers.Cookie[key] + '; ';
                                            }
                                        }
                                        headers[AppSpider.TOKEN+header] = cookie_str;
                                        break;
                                    case 'REQUEST':
                                        break; //skip
                                    default:
                                        headers[AppSpider.TOKEN+header] = attack_headers[header];
                                        break;
                                }
                            }
                        } else {
                            headers[header] = attack_headers[header];
                        }
                    }
                    break;
                default:
                    console.error('Appspider.js: Cannot parse the headers!!');
                    return false;
            }
            return headers;
        }

    }
};
/* JQUERY */
$('#appspider-logo').click(function(e){
    console.log('AppSpider logo clicked!!');
    e.preventDefault();
    $('#wrapper').toggleClass('toggled');
});

/* CHROME API */
chrome.storage.onChanged.addListener(function(attacks, namespace){
    for (var attack_id in attacks) {
        var attack_storage = attacks[attack_id];
        $('textarea#attack-request-headers-'+attack_id).val(AppSpider.helper.convertJSONToString(attack_storage.newValue.headers));
        $('textarea#attack-attack-request-payload-'+attack_id).val(attack_storage.newValue.payload);
        $('textarea#attack-response-headers-'+attack_id).val(attack_storage.newValue.response_headers);
        $('textarea#attack-response-content-'+attack_id).val(attack_storage.newValue.response_content);
    }
});