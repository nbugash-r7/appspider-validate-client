/**
 * Created by nbugash on 15/01/16.
 */

var AppSpiderValidateApp = angular.module('AppSpiderValidateApp', []);
var Angular = {
    controller: {
        AttackController: function($scope) {
            var appspider = this;

            AppSpider.attacks.getAllAttacks($scope, function(results){
                appspider.getAttacks(results);
            });
            appspider.getAttacks = function(attacks) {
                appspider.attacks = attacks;
            };
            appspider.prettifyAttack = function(headers) {
                var attack_str = "";
                try {
                    if (headers.REQUEST) {
                        for (var key in headers.REQUEST) {
                            attack_str += headers.REQUEST[key] + " "
                        }
                        attack_str += "\r\n";
                    }
                } catch (err) {
                    console.error("App.js: Error handling headers.REQUEST");
                    return;
                }
                for (var header in headers) {
                    switch(header) {
                        case "REQUEST":
                            break;
                        case "Cookie":
                            var cookie_str = "";
                            for(var key in headers[header]) {
                                cookie_str += key + "=" + headers[header][key] + "; "
                            }
                            attack_str += header +": " + cookie_str + "\r\n";
                            break;
                        default:
                            attack_str += header + ": " + headers[header] + "\r\n";
                            break;
                    }
                }
                return attack_str;
            };
            appspider.updateAttack = function(attack_id, attack_attr, content) {
                AppSpider.attack.load(attack_id, function(attack){
                    attack[attack_attr] = content;
                    AppSpider.attack.save(attack_id, attack);
                });
            };
            appspider.getAttack = function($scope,attack_id) {
                AppSpider.attack.load($scope, attack_id, function(attack){
                    return attack;
                });
            };
            appspider.saveAttack = function(attack_id, new_attack) {
                AppSpider.attack.load(attack_id, function(attack){
                    AppSpider.attack.save(attack_id, new_attack);
                });
            };
        },
        PanelController: function() {
            var panel = this;
            panel.tab = "1";
            panel.view = "RAW";
            panel.selectTab = function (setTab) {
                panel.tab = setTab;
            };
            panel.isSelected = function (checkTab) {
                return panel.tab === checkTab;
            };
        },
        ButtonController: function($scope, $http) {
            var button = this;
            button.view = 'RAW';
            button.protocoltype = 'HTTP';
            button.viewDropdown = function(attack_id, viewtype){
                console.log("View dropdown clicked with value " + viewtype + " on attack id: " + attack_id);
                button.view = viewtype;
            };
            button.protocolDropdown = function(attack_id, protocoltype){
                console.log("Protocol dropdown clicked with value " + protocoltype + " on attack id: " + attack_id);
                button.protocoltype = protocoltype;
            };
            button.proxy = function(attack_id){
                console.log("Proxy button clicked on attack id: " + attack_id);
            };
            button.editCookie = function(attack_id){
                console.log("Edit Cookie button clicked attack id: " + attack_id);
                var channel = chrome.runtime.connect({name: "app.js"});
                channel.postMessage({
                    type: 'setCurrentStep',
                    data: {
                        current_step: attack_id
                    }
                });
                channel.onMessage.addListener(function(message){
                    if (message.from === "Background.js" && message.type === "currentStep" ) {
                        chrome.tabs.create({
                            url: chrome.extension.getURL('cookiepopup.html'),
                            active: false
                        }, function (tab) {
                            // After the tab has been created, open a window to inject the tab
                            chrome.windows.create({
                                tabId: tab.id,
                                type: 'popup',
                                focused: true,
                                width: 600,
                                height: 435
                                // incognito, top, left, ...
                            }, function(window){
                                chrome.windows.update(window.id,{
                                    focused: true
                                });
                            });
                        });
                    } else {
                        console.error("App.js: Unable to handle message from "
                            + message.from + " with message type: "+ message.type);
                    }
                });

            };
            button.resetRequest = function(attack_id){
                console.log("Reset request button clicked attack id: " + attack_id);
            };
            button.sendRequest = function(attack_id){
                console.log("Send request button clicked attack id: " + attack_id);
                /*
                 * (1) Get attack from local storage
                 * (2) Create an angular http request / https request
                 *     with custom headers and payload
                 * (3) Wait for response back from server
                 * (4) Display response to web ui
                 * */

                /* Sending the attack header to Background.js
                 * to be used by the onBeforeSendHeaders Listener
                 */
                AppSpider.attack.load($scope, attack_id, function(attack){
                    var channel = chrome.runtime.connect({name: "app.js"});
                    channel.postMessage({
                        type: 'savehttpHeaders',
                        data: {
                            headers: attack.headers
                        }
                    });

                    channel.onMessage.addListener(function(message){
                        /* Message from background.js */
                        if (message.type === "httpHeaderSaved" && message.from === "Background.js") {
                            $http({
                                method: attack.headers.REQUEST.method,
                                url: button.protocoltype + "://" + attack.headers.Host + attack.headers.REQUEST.uri,
                                data: attack.payload
                            }).then(function successRequest(response){
                                console.log("Success!!");
                                attack['response_headers'] = response.headers();
                                attack['response_content'] = response.data;
                                AppSpider.attack.save(attack_id, attack);
                            }, function errorRequest(response){
                                console.error("App.js: Error - " + response);
                            });

                        } else {
                            console.error("App.js: Invalid message from " + message.from +
                                " with message type:" + message.type);
                        }
                    });
                });
            };
            button.compare = function(attack_id){
                console.log("Compare button clicked attack id: " + attack_id);
            };
        }
    },
    directive: {
        prettifyheader: function() {
            return {
                require: "ngModel",
                link: function(scope, element, attr, ngModelController) {
                    /* Convert data from view format to model format */
                    ngModelController.$parsers.push(function(data){
                        console.log("Convert data from view format to model format");
                    });

                    /* Convert data from model format to view format */
                    ngModelController.$formatters.push(function(data){
                        console.log("Convert data from model format to view format");
                        var attackController = new Angular.controller.AttackController(scope);
                        return attackController.prettifyAttack(data);
                    });
                }
            }
        }
    }
};
AppSpiderValidateApp.controller('AttackController', ['$scope', Angular.controller.AttackController]);
AppSpiderValidateApp.controller('PanelController', [Angular.controller.PanelController]);
AppSpiderValidateApp.controller('ButtonController', ['$scope','$http', Angular.controller.ButtonController]);
AppSpiderValidateApp.directive('prettifyheader', [Angular.directive.prettifyheader]);

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