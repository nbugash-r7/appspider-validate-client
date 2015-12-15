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
* */

var ractive = new Ractive({
    el: '.appspider-cookie-row',
    template: existing_pair,
    data:{
        cookies:{
            'key1':'value1',
            'key2':'value2',
            'key3':'value3'
        }
    }
});

var AppSpiderCookies = {

};