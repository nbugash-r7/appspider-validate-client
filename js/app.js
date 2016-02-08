/**
 * Created by nbugash on 15/01/16.
 */
var token = 'appspider-';
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
                return AppSpider.helper.convertJSONToString(headers);
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
                        /* Parameters:
                        * (1) html page
                        * (2) width
                        * (3) height*/
                        AppSpider.chrome.openNewWindow('cookiepopup.html',600, 435);
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

                    var headers = AppSpider.http.modifyHeaders(attack.headers);
                    //for (var header in attack.headers) {
                    //    if (attack.headers.hasOwnProperty(header)){
                    //        if(_.contains(restrictedChromeHeaders, header.toUpperCase())){
                    //            if (header === "Cookie") {
                    //                var cookie_str = "";
                    //                for(var key in attack.headers.Cookie) {
                    //                    if(attack.headers.Cookie.hasOwnProperty(key)){
                    //                        cookie_str += key + "=" + attack.headers.Cookie[key] + "; "
                    //                    }
                    //                }
                    //                headers[token+header] = cookie_str;
                    //            } else {
                    //                headers[token+header] = attack.headers[header];
                    //            }
                    //        } else {
                    //            headers[header] = attack.headers[header];
                    //        }
                    //    }
                    //}

                    if (typeof headers === "object") {
                        $http({
                            method: attack.headers.REQUEST.method,
                            url: button.protocoltype + "://" + attack.headers.Host + attack.headers.REQUEST.uri,
                            headers: headers,
                            data: attack.payload
                        }).then(function successRequest(response){
                            console.log(response.statusText + ": Received response successfully!!");
                            switch(typeof response.headers()){
                                case "object":
                                    attack.response_headers = AppSpider.helper.convertJSONToString(response.headers());
                                    break;
                                default:
                                    attack.response_headers = response.headers();
                                    break;
                            }
                            attack.response_content = response.data;
                            AppSpider.attack.save(attack_id, attack);
                        }, function errorRequest(response){
                            attack.response_headers = "Error:\r\nUnable to obtain the response header for " +
                                button.protocoltype.toLocaleLowerCase() + "://" + attack.headers.Host + attack.headers.REQUEST.uri;
                            attack.response_content = "Error: Unable to obtain the response body";
                            AppSpider.attack.save(attack_id, attack);
                            console.error("App.js: Error - " + response);
                        });
                    }

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