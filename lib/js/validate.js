/**
 * Created by nbugash on 16/10/15.
 */
/* Global Variable */
var encodedHttp;
var decodedHeader;
var data;
var current_step;

/* HTML TEMPLATE  */
var attackTemplateImport = (document.getElementById('attack-request-template')).import;
var attackRequestTemplate = attackTemplateImport.body.innerHTML;

var payloadTemplateImport = (document.getElementById('payload-template')).import;
var payloadTemplate = payloadTemplateImport.body.innerHTML;

var headerButtonsTemplateImport = (document.getElementById('header-btn-template')).import;
var headerButtonsTemplate = headerButtonsTemplateImport.body.innerHTML;

var attackResponseTemplateImport = (document.getElementById('attack-response-template')).import;
var attackResponseTemplate = attackResponseTemplateImport.body.innerHTML;

var contentResponseTemplateImport = (document.getElementById('content-response-template')).import;
var contentResponseTemplate = contentResponseTemplateImport.body.innerHTML;

var buttonTemplateImport = (document.getElementById('btn-template')).import;
var buttonTemplate = buttonTemplateImport.body.innerHTML;

var stepTemplate =
    "<h3>{{step_name}}</h3>" +
    attackRequestTemplate +
    payloadTemplate +
    headerButtonsTemplate +
    attackResponseTemplate +
    contentResponseTemplate +
    buttonTemplate;

var AppSpiderValidate = {

    decodeHeader: function(sHTTPHeader) {
        return window.atob(sHTTPHeader);
    },

    parseHeader: function(requests) {
        var data = {};
        var step_num = 1;
        var array_request = requests.split(/(#H#G#F#E#D#C#B#A#)/);
        for (var i = 0; i < array_request.length; i++ ) {
            var step = {};
            if (array_request[i].indexOf("#A#B#C#D#E#F#G#H#") > -1) {
                var array = array_request[i].split(/(#A#B#C#D#E#F#G#H#)/);
                /*TODO: Split the request to header and payload*/
                var request = array[0].trim();

                request = AppSpiderValidate.splitRequest(request);
                var headers = request[0];
                var payload = request[1];

                var desc = array[array.length -1].trim();
                /* Debugging */
                data['step' + step_num] = {
                    step_id: "step"+step_num,
                    step_name: "Step " + step_num,
                    attack_request_header: headers,
                    attack_payload: payload,
                    attack_description: desc
                };
                step_num++;
            }
        }
        return data;
    },

    splitRequest: function(request){
        var lines = request.split('\n');
        var headers = "", payload = "", isHeader = true;
        for (var line in lines){
            line = lines[line];
            if (line.trim() == ''|| !isHeader){
                isHeader = false;
            }
            switch (isHeader){
                case true:
                    headers = headers + line.trim() + "\r\n";
                    break;
                default:
                    payload = payload + line.trim() + "\r\n";
                    break;
            }
        }
        return [headers.trim(),payload.trim()];
    },

    makeRequest: function(request) {
        current_step = request.step_id;
        var data = request.data;
        var attack = {
            'headers': AppSpiderValidate.parseRequest(data),
            'payload': $('textarea#payload-data-step' + current_step).val()
        };
        AppSpiderValidate.sendRequest(attack);
    },

    /* Private */
    parseRequest: function(unparse_request) {
        var array = unparse_request.split("\n");
        var headers = {};
        for (var i = 0; i < array.length; i++) {
            var header = array[i];
            if (header.match(/GET|POST/)) {
                headers['Initial-Request-Line'] = header.trim();
            } else if (header.indexOf(':') > -1) {
                var a = header.split(':');
                headers[a[0].trim().toUpperCase()] = a[a.length -1].trim();
            }
        }
        return headers
    },

    /* Private */
    sendRequest: function(attack) {
        var headers = attack.headers;
        var data = {};
        var method, url;
        var a = headers['Initial-Request-Line'].split(' ');
        var protocol = $('.protocol-btn').text().trim().split(/\s+/)[current_step - 1] +"://";
        if (a.length == 3) {
            data['method'] = a[0];
            /*TODO: Need to have the ability to switch from http to https*/
            data['url'] = protocol.toLowerCase() + headers['HOST'] + a[1];
            data['http-version'] = a[2];
        }
        data['headers'] = headers;
        data['payload'] = attack.payload;
        AppSpiderValidate.sendMessage({
            'type':'sendRequest',
            'data': data
        })

    },

    hideDiv: function(divID) {
        var div = document.getElementById(divID);
        if (div.style.display !== 'none') {
            div.style.display = 'none'
        }
    },

    showDiv: function(divID) {
        var div = document.getElementById(divID);
        if (div.style.display == 'none') {
            div.style.display = ''
        }
    },

    renderTemplate: function(template,id_tag,data) {
        if (template == 'stepTemplate') {
            template = stepTemplate;
        }
        for (var step in data) {
            var output = Mustache.to_html(template,data[step]);
            var stepHTML = document.getElementById(id_tag);
            var div = document.createElement('div');
            div.setAttribute('id', step);
            switch(step) {
                case 'step1':
                    div.setAttribute('class','tab-pane fade in active');
                    break;
                default:
                    div.setAttribute('class','tab-pane fade');
                    break;
            }
            div.innerHTML = output;
            stepHTML.appendChild(div);
        }
    },

    renderNavTemplate: function(data) {
        var navHTML = document.getElementById('appspider-nav');
        for (var step in data) {
            var li = document.createElement('li');
            switch(step){
                case 'step1':
                    li.setAttribute('class','active');
                    break;
                default:
                    li.setAttribute('class', '');
                    break;
            }
            li.setAttribute('role','presentation')
            var a = document.createElement('a');
            a.setAttribute('data-toggle','pill');
            a.setAttribute('href','#'+step);
            a.innerHTML = data[step].step_name;
            li.appendChild(a);
            navHTML.appendChild(li);
        }

    },

    getEncodedHTTPRequest: function() {
        AppSpiderValidate.sendMessage({
            type: 'getEncodedHTTPRequest'
        });
    },
    /* Structure of message json */
    /*
    * message = {
    *   'type':'',
    *   'data': {} // optional
    * }
    * */
    sendMessage: function(message){
        var channel = chrome.runtime.connect({name: 'validate.js'});
        channel.postMessage(message);

        /* Waiting for response back from the Background js */
        channel.onMessage.addListener(function(message, sender){
            switch (message.type) {
                case 'httpResponse':
                    $('#attack-header-response-step'+current_step).val(message.data.attack_response);
                    $('#content-attack-data-step'+ current_step).val(message.data.content_response);
                    break;
                case 'encodedHTTPRequest':
                    encodedHttp = message.data.encodedHTTPRequest;
                    decodedHeader = AppSpiderValidate.decodeHeader(encodedHttp);
                    data = AppSpiderValidate.parseHeader(decodedHeader);
                    document.getElementById('appspider-nav').addEventListener('onload', AppSpiderValidate.renderNavTemplate(data));
                    document.getElementById('step-template').addEventListener('onload', AppSpiderValidate.renderTemplate('stepTemplate','step-template', data));
                    break;
            }
        });

    }
};

/* Event Handler */
document.addEventListener('onload', AppSpiderValidate.getEncodedHTTPRequest());
