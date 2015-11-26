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
        $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
    });
;