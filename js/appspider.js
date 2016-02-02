/**
 * Created by nbugash on 14/01/16.
 */
var AppSpider = {
    chrome: {
        store: function (id, obj) {
            var object = {};
            object[id] = obj;
            chrome.storage.local.set(object, function () {
                console.log("Object " + id + " was saved to the chrome.storage.local");
                return true;
            });
        },
        retrieve: function ($scope, id, callback) {
            chrome.storage.local.get(id, function (result) {
                console.log("Attack " + id + " loaded!!");
                $scope.$apply(function(){
                    callback(result[id]);
                });
            });
        },
        retrieveAll: function ($scope, callback) {
            chrome.storage.local.get(null, function(results){
                console.log("All attacks were retrieved!!");
                $scope.$apply(function(){
                    callback(results);
                });
            });
        }
    },
    attack: {
        save: function(attack_id, attack_obj){
            return AppSpider.chrome.store(attack_id,attack_obj);
        },
        load: function($scope, attack_id, callback){
            AppSpider.chrome.retrieve($scope, attack_id,callback);
        },
        update: function(attack_id, attack_key, attack_value) {
            AppSpider.chrome.retrieve(attack_id, function(attack) {
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
                data.url = protocol.toLowerCase() + "://" + attack.headers.Host + http_request[1];
                data.http_version = http_request[2];

                /* Setting up the attack */
                delete attack.headers.REQUEST;
                data.headers = attack.headers;
                if (attack.payload) {
                    data.payload = attack.payload;
                }

                /* Sending the message...*/
                var channel = chrome.runtime.connect({name: "appspider.js"});
                channel.postMessage({
                    type: "send_request",
                    data: data
                });

                /* Wait for asynchronous callback */
                channel.onMessage.addListener(function(message, sender) {
                    switch(message.type) {
                        case "http_response":
                            console.log("appspider.js: Receive http response!!");
                            callback(message.data);
                            break;
                        default:
                            console.log("appspider.js: Unable to handle message from " + message.from);
                            break;
                    }
                });

            });
        }
    }
};

chrome.storage.onChanged.addListener(function(attacks, namespace){
    for (var attack_id in attacks) {
        var attack_storage = attacks[attack_id];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            attack_id,
            namespace,
            attack_storage.oldValue,
            attack_storage.newValue);
        $('textarea#attack-response-headers-'+attack_id).val(attack_storage.newValue.response_headers);
        $('textarea#attack-response-content-'+attack_id).val(attack_storage.newValue.response_content);
    }
});