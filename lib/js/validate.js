/**
 * Created by nbugash on 16/10/15.
 */
/* Global Variable */
var encodedhttp;
var decodedHeader;
var data;

/* HTML TEMPLATE  */
var attackRequestTemplate =
    "<div class='form-group'>"+
    "<label>Attack Request</label>" +
    "<textarea rows='5' id='attack-request-headers' class='form-control'>{{attack_request_header}}</textarea>" +
    "</div>";

var viewTemplate =
    "<div class='form-group'>" +
    "<label>View</label>" +
    "<textarea rows='5' class='form-control'>{{view_data}}</textarea>" +
    "</div>";

var headerButtonsTemplate =
    "<div class='container-fluid'>" +
    "<div class='row'>" +
    "<div class='col-xs-2 text-center'>" +
    "<div class='dropdown'>" +
    "<button class='btn btn-primary dropdown-toggle' type='button' data-toggle='dropdown'>Select View" +
    "<span class='caret'></span>" +
    "</button>" +
    "<ul class='dropdown-menu'>" +
    "<li><a href='#'>Raw View</a></li>" +
    "<li><a href='#'>Tabular View</a></li>" +
    "</ul>" +
    "</div>" +
    "</div>" +
    "<div class='col-xs-2 text-center'>" +
    "<div class='dropdown'>" +
    "<button class='btn btn-primary dropdown-toggle' type='button' data-toggle='dropdown'>Protocol" +
    "<span class='caret'></span>" +
    "</button>" +
    "<ul class='dropdown-menu'>" +
    "<li><a href='#'>http</a></li>" +
    "<li><a href='#'>https</a></li>" +
    "</ul>" +
    "</div>" +
    "</div>" +
    "<div class='col-xs-8 text-center'>" +
    "<button id='proxy-btn' type='button' class='btn btn-default'>Proxy</button>" +
    "<button id='edit-cookies-btn' type='button' class='btn btn-default'>Edit Cookie</button>" +
    "<button id='reset-request-btn' type='button' class='btn btn-default'>Reset Request</button>" +
    "<button id='send-request-btn' type='button' class='btn btn-default'>Send Request</button>" +
    "<button id='compare-btn' type='button' class='btn btn-default'>Compare</button>" +
    "</div>" +
    "</div>" +
    "</div>";

var attackResponseTemplate =
    "<div class='form-group'>" +
    "<label>Attack Response</label>" +
    "<textarea rows='5' class='form-control'>{{attack_response_data}}" +
    "</textarea>" +
    "</div>";

var contentResponseTemplate =
    "<div class='form-group'>" +
    "<label>Content Response</label>" +
    "<textarea rows='5' class='form-control'>{{content_response_data}}" +
    "</textarea>" +
    "</div>";

var buttonTemplate =
    "<button type='button' class='btn btn-default'>Highlight Vulnerability</button>" +
    "<button type='button' class='btn btn-default'>Show Response in a Browser</button>" +
    "<button type='button' class='btn btn-default'>Help</button>";

var stepTemplate =
    "<h3>{{step_num}}</h3>" +
    attackRequestTemplate +
    viewTemplate +
    headerButtonsTemplate +
    attackResponseTemplate +
    contentResponseTemplate +
    buttonTemplate;

var AppSpiderValidate = {

    //encodedhttp: null,
    //decodedHeader: null,
    //data: null,

    decodeHeader: function(sHTTPHeader) {
        var decodedHeader = window.atob(sHTTPHeader);
        return decodedHeader;
    },

    parseHeader: function(requests) {
        var data = {};
        var step_num = 1;
        var array_request = requests.split(/(#H#G#F#E#D#C#B#A#)/);
        for (var i = 0; i < array_request.length; i++ ) {
            var step = {};
            if (array_request[i].indexOf("#A#B#C#D#E#F#G#H#") > -1) {
                var array = array_request[i].split(/(#A#B#C#D#E#F#G#H#)/);
                var request = array[0].trim();
                var desc = array[array.length -1].trim();
                /* Debugging */
                data['step' + step_num] = {
                    step_num: "Step " + step_num,
                    attack_request_header: request,
                    attack_description: desc
                };
                step_num++;
            }
        }
        return data;
    },

    makeRequest: function(request) {
        var headers = AppSpiderValidate.parseRequest(request);
        AppSpiderValidate.sendRequest(headers);
    },

    /* Private */
    parseRequest: function(unparse_request) {
        var array = unparse_request.split("\n");
        var headers = {}
        for (var i = 0; i < array.length; i++) {
            var header = array[i];
            if (header.match(/GET|POST/)) {
                headers['Initial-Request-Line'] = header;
            } else if (header.indexOf(':') > -1) {
                var a = header.split(':');
                headers[a[0].trim()] = a[a.length -1].trim();
            }
        }
        return headers
    },

    /* Private */
    sendRequest: function(headers) {
        var data = {};
        var method = "";
        var path = "";
        var http_version = "";
        var host = "";

        var a = headers['Initial-Request-Line'].split(' ');
        if (a.length == 3) {
            method = a[0];
            path = a[1];
            http_version = a[2];
            data['host'] = headers['Host'];
            data['path'] = path;
            data['method'] = method;
        }

        for (var header in headers) {
            if (header != 'Initial-Request-Line') {
                data[header] = headers[header];
            }
        }
        return data;
    },

    hidePage: function(pageId) {
        var div = document.getElementById(pageId);
        if (div.style.display !== 'none') {
            div.style.display = 'none'
        } else {
            div.style.display = 'block'
        }
    },

    renderTemplate: function(template,id_tag,data) {
        if (template == 'stepTemplate') {
            template = stepTemplate;
        }
        for (var step in data) {
            var output = Mustache.to_html(template,data[step]);
            var stephtml = document.getElementById(id_tag);
            var div = document.createElement('div');
            div.setAttribute('id', step);
            if (step == 'step1') {
                div.setAttribute('class','tab-pane fade in active');
            } else {
                div.setAttribute('class','tab-pane fade');
            }
            div.innerHTML = output;
            stephtml.appendChild(div);
        };
    },

    renderNavTemplate: function(data) {
        var navhtml = document.getElementById('appspider-nav');
        for (var step in data) {
            var li = document.createElement('li');
            if (step == 'step1') {
                li.setAttribute('class','active');
            } else {
                li.setAttribute('class', '');
            }
            var a = document.createElement('a');
            a.setAttribute('data-toggle','pill');
            a.setAttribute('href','#'+step);
            a.innerHTML = data[step].step_num;
            li.appendChild(a);
            navhtml.appendChild(li);
        }

    },

    getEncodedHTTPRequest: function() {
        /* Open a channel */
        var channel = chrome.runtime.connect({name: "validate.js"});

        /* Send a message to the backround.js */
        channel.postMessage({type: "getEncodedHTTPRequest"});

        /* Wait for a response back from the background.js*/
        channel.onMessage.addListener(function(message, sender){
            if (message.fromJS == "background.js" && message.type == "encodedHTTPRequest"){
                var encodedHTTPRequest = message.data.encodedHTTPRequest;
                encodedhttp = encodedHTTPRequest;
                decodedHeader = AppSpiderValidate.decodeHeader(encodedhttp);
                data = AppSpiderValidate.parseHeader(decodedHeader);
                document.getElementById('appspider-nav').addEventListener('onload', AppSpiderValidate.renderNavTemplate(data));
                document.getElementById('step-template').addEventListener('onload', AppSpiderValidate.renderTemplate('stepTemplate','step-template', data));
            }
        });
    }

};

/* Event Handler */
//document.addEventListener('onload', AppSpiderValidate.getEncodedHTTPRequest());
//document.getElementById('send-request-btn').addEventListener('click', AppSpiderValidate.makeRequest($('textarea#attack-request-headers').val()));

document.addEventListener('DOMContentLoaded', function(){
    AppSpiderValidate.getEncodedHTTPRequest();
    document.getElementById('send-request-btn').addEventListener('click', AppSpiderValidate.makeRequest($('textarea#attack-request-headers').val()));
});