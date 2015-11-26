/**
 * Created by nbugash on 25/11/15.
 */

/* Adding Event handler using JQuery */
$('#step-template')
    .on('click', '#send-request-btn', function(){
        AppSpiderValidate.makeRequest($('textarea#attack-request-headers').val());
    })
    .on('click', '#proxy-btn', function(){
        alert('Proxy btn clicked');
    })
    .on('click', '#edit-cookies-btn', function(){
        alert('Edit btn clicked');
    })
    .on('click', '#reset-request-btn', function(){
        alert('Reset btn clicked');
    })
    .on('click', '#compare-btn', function(){
        alert('Compare btn clicked');
    })
    .on('click', '.dropdown-menu li a', function(){
        var selText = $(this).text();
        switch(selText.toUpperCase()){
            case 'RAW':
                AppSpiderValidate.showDiv('attack-request-headers-form');
                AppSpiderValidate.hideDiv('pattack-request-headers-form');
                $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
                break;
            case 'PRETTIFY':
                AppSpiderValidate.showDiv('pattack-request-headers-form');
                AppSpiderValidate.hideDiv('attack-request-headers-form');
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
        $('.input_fields_wrap').append('<div class="input-group row request-headers"><div class="col-xs-5"><input class="form-control header" type="text" placeholder="Header" name="mytext[]"/></div><div class="col-xs-5"><input class="form-control header-value" type="text" placeholder="Value" name="mytext[]"/></div><div class="col-xm-2"><a href="#" class="remove_field"><button type="button" class="btn btn-default btn-xs header-remove-btn">X</button></a></div></div>'); //add input box
    })
    .on('click', '.remove_field', function(e){
        e.preventDefault();
        $(this).parent().parent('div').remove();

    })
;