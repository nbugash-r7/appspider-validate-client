/**
 * Created by nbugash on 01/12/15.
 */
var new_row_template = (document.getElementById('add-cookie-pair')).import;
var new_row = new_row_template.body.innerHTML;
$('.appspider-cookie-addrow').click(function(e){
    e.preventDefault();
    $('.appspider-cookie-row').append(new_row);
});

