/**
 * Created by nbugash on 25/11/15.
 */

var headerTemplateImport = (document.getElementById('add-header-template')).import;
var headerTemplate = headerTemplateImport.body.innerHTML;
var current_step = 1;
$('ul#appspider-nav')
    .on('click', 'li a', function(){
        current_step = parseInt($(this).attr('href').slice(5));
        var channel = chrome.runtime.connect({name: 'eventhandler.js'});
        channel.postMessage({
            type: 'setCurrentStep',
            data: {
                current_step: current_step
            }
        });
    });
/* Adding event handler for the window */
window.addEventListener('focus', function(event){

});

/* Adding Event handler using JQuery */
$('#step-template')
    .on('click', '.send-request-btn', function(){
        var viewVal = $('.select-view-btn').text().trim().split(/\s+/);
        var request = {};
        request['step_id'] = current_step;
        switch(viewVal[current_step - 1].toUpperCase()){
            case 'RAW':
                /* TODO: Save any changes to the textarea */
                var step_id = "step"+current_step;
                AppSpiderValidate.updateAttack('RAW', step_id);
                AppSpiderValidate.makeRequest(step_id);
                break;
            case 'PRETTIFY':
                /* TODO: Need to address attack request when user uses prettified version */
                break;
        }
    })
    .on('click', '.proxy-btn', function(){
        alert('Proxy btn clicked in Step '+ current_step);
    })
    .on('click', '.edit-cookies-btn', function(){
        chrome.tabs.create({
            url: chrome.extension.getURL('lib/misc/cookiepopup.html'),
            active: false
        }, function (tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true,
                width: 600,
                height: 250
                // incognito, top, left, ...
            }, function(window){
                chrome.windows.update(window.id,{
                    focused: true
                });
            });
        });
    })
    .on('click', '.reset-request-btn', function(){
        location.reload(true);
    })
    .on('click', '.compare-btn', function(){
        alert('Compare btn clicked in Step '+ current_step);
    })
    .on('click', '.dropdown-menu li a', function(){
        var selText = $(this).text();
        switch(selText.toUpperCase()){
            case 'RAW':
                AppSpiderValidate.showDiv('attack-request-headers-form-step'+current_step);
                AppSpiderValidate.hideDiv('pattack-request-headers-form-step'+current_step);
                $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
                break;
            case 'PRETTIFY':
                AppSpiderValidate.showDiv('pattack-request-headers-form-step'+current_step);
                AppSpiderValidate.hideDiv('attack-request-headers-form-step'+current_step);
                $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
                break;
            case 'GET':
                $(this).parents('.input-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
                break;
            case 'POST':
                $(this).parents('.input-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
                break;
            case 'HTTP':
                $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
                break;
            case 'HTTPS':
                $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
                break;
        }
    })
    .on('click','.add_field_button', function(e){
        e.preventDefault();
        $('#input_fields_wrap-step' + current_step).append(headerTemplate); //add input box
    })
    .on('click', '.remove_field', function(e){
        e.preventDefault();
        $(this).parent().parent('div').remove();

    })
;