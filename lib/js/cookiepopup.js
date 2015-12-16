/**
 * Created by nbugash on 01/12/15.
 */
var existing_pair_template = (document.getElementById('existing-cookie-pair')).import;
var existing_pair = existing_pair_template.body.innerHTML;

var new_row_template = (document.getElementById('add-cookie-pair')).import;
var new_row = new_row_template.body.innerHTML;

$('.appspider-cookie-addrow').click(function(e){
    e.preventDefault();
    $('.appspider-cookie-row').append(new_row);
});

/*
* (0) Get current step
* (1) Retrieve cookies
* (2)
*
* */
var AppSpiderCookie = {
    loadPage: function() {
        var channel = chrome.runtime.connect({name: 'cookiepopup.js'});
        channel.postMessage({
            type: 'getCurrentStep'
        });

        channel.onMessage.addListener(function(message, sender){
            switch(message.type) {
                case 'getCurrentStep':
                    var current_step = "step" + message.data.current_step;
                    chrome.storage.local.get(current_step, function(results){
                        console.log('Attack ' + current_step + " found!!");
                        var ractive = new Ractive({
                            el: '.appspider-cookie-row',
                            template: existing_pair,
                            data: {
                                cookies: results[current_step].attack_request_header['COOKIE']
                            }
                        });
                    });
                    break;
                default:
                    break;
            }
        });
    }
};

document.addEventListener('onload', AppSpiderCookie.loadPage());