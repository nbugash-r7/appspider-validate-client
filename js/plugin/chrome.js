/**
 * Created by nbugash on 3/8/16.
 */

if (appspider === undefined) {
    var appspider = {};
}
appspider.chrome = {
    global: {
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
        ],
        TOKEN: 'appspider-'
    },
    storage: {
        local: {
            save: function (obj, callback) {
                chrome.storage.local.set(obj, callback);
            },
            retrieve: function (id, callback) {
                chrome.storage.local.get(id, function (result) {
                    callback(result[id]);
                });
            },
            retrieveAll: function (callback) {
                chrome.storage.local.get(null, function (results) {
                    callback(results);
                });
            },
            getSize: function (callback) {
                chrome.storage.local.get(null, function (results) {
                    callback(_.size(results));
                });
            },
            saveAttack: function (attack, callback) {
                var attackObj = {};
                attackObj[attack.id] = attack;
                chrome.storage.local.set(attackObj, callback);
            }
        }
    },
    window: {
        open: function (htmlpage, width, height) {
            var options = {
                url: chrome.extension.getURL('../' + htmlpage),
                active: false
            };
            chrome.tabs.create(options, function (tab) {
                var newWindowOption = {
                    tabId: tab.id,
                    type: 'popup',
                    focused: true,
                    width: width,
                    height: height
                };
                chrome.windows.create(newWindowOption);
                console.log('Opening ' + htmlpage + ' page');
            });
        }
    }
};