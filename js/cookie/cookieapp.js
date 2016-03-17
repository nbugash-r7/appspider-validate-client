/**
 * Created by nbugash on 01/02/16.
 */
var CookieApp = angular.module('CookieApp',[]);
var Angular = {
    controller: {
        CookieController: function($scope){
            var attack = this;
            $scope.cookies = {};
            var channel = chrome.runtime.connect({name:'cookieapp.js'});
            channel.postMessage({
                type: 'getCurrentStep'
            });
            channel.onMessage.addListener(function(message) {
                if (message.from === 'Background.js' && message.type === 'currentStep') {
                    attack.id = message.data.current_step;
                    AppSpider.attack.load($scope, attack.id, function(attack_result) {
                        for (var key in attack_result.headers.Cookie) {
                            if (attack_result.headers.Cookie.hasOwnProperty(key)){
                                $scope.cookies[key] = attack_result.headers.Cookie[key];
                            }
                        }
                    });
                }
            });
            attack.saveCookies = function(key, value) {
                if (key) {
                    attack.updateCookie(key, value);
                }
                AppSpider.attack.load($scope, attack.id,function(retrieved_attack){
                    var cookies = {};
                    for (var key in $scope.cookies) {
                        if ($scope.cookies.hasOwnProperty(key)){
                            cookies[key] = $scope.cookies[key];
                        }
                    }
                    retrieved_attack.headers.Cookie = cookies;
                    AppSpider.attack.save(attack.id, retrieved_attack);
                    window.close();
                });
            };
            attack.addCookies = function(key, value) {
                $scope.cookies[key] = value;
                $scope.key = null;
                $scope.value = null;
            };
            attack.updateCookie = function(key, value) {
                $scope.cookies[key] = value;
            };
            attack.removeCookie = function(key) {
                $scope.cookies[key] = _.omit($scope.cookies, key);
            };
        }
    },
    directive: {
        removeOnClick: function(){
            return {
                link: function(scope, elt, attrs) {
                    scope.removeKeyValuePair = function(key){
                        if (key) {
                            delete this.cookies[key];
                        }
                        elt.html('');
                    };
                }
            };
        }
    }
};
CookieApp.controller('CookieController',['$scope', Angular.controller.CookieController]);
CookieApp.directive('removeOnClick', [Angular.directive.removeOnClick]);
