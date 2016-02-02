/**
 * Created by nbugash on 01/02/16.
 */
var CookieApp = angular.module('CookieApp',[]);
var Angular = {
    controller: {
        CookieController: function($scope){
            var attack = this;
            var channel = chrome.runtime.connect({name:"cookieapp.js"});
            channel.postMessage({
                type: "getCurrentStep"
            });
            channel.onMessage.addListener(function(message) {
                if (message.from === "Background.js" && message.type === "currentStep") {
                    attack.id = message.data.current_step;
                    AppSpider.attack.load($scope, attack.id, function(attack_result) {
                        attack.cookies = attack_result.headers.Cookie;
                    });
                }
            });

            attack.saveCookies = function() {
                AppSpider.attack.load(attack.id, function(attack){
                    attack.headers.Cookie = attack.cookies;
                    AppSpider.attack.save(attack.id, attack);
                    console.log("Cookie saved!!");
                });
            };
            attack.getCookies = function(){
                return attack.cookies;
            };
        }
    }
};
CookieApp.controller('CookieController',['$scope', Angular.controller.CookieController]);
