/**
 * Created by nbugash on 16/10/15.
 */
/* Global Variable */
var encodedHttp;
var decodedHeader;
var data;
var current_step;
var global_cookie;

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

    parseRequest: function(requests) {
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
                var headers = AppSpiderValidate.parseHeader(request[0]);
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

    makeRequest: function(current_step) {
        /*TODO: Data needs to be coming from the storage*/
        AppSpiderValidate.retrieveAttack(current_step, function(results){
            console.log(results);
            AppSpiderValidate.sendRequest({
                'headers': results.attack_request_header,
                'payload': results.attack_payload
            });
        });


    },

    /* Private */
    parseHeader: function(unparse_headers) {
        var array = unparse_headers.split("\n");
        var headers = {};
        for (var i = 0; i < array.length; i++) {
            var header = array[i];
            if (header.match(/GET|POST/) && header.indexOf("REQUEST") <= -1) {
                headers['REQUEST'] = header.trim();
            } else if (header.indexOf(':') > -1) {
                var a = header.split(':');
                headers[a[0].trim().toUpperCase()] = a[a.length -1].trim();
            }
        }
        return headers
    },

    /* Private */
    sendRequest: function(attack) {
        var data = {};
        var method, url;
        var a = attack.headers['REQUEST'].split(' ');
        var protocol = $('.protocol-btn').text().trim().split(/\s+/)[current_step - 1] +"://";
        if (a.length === 3) {
            data['method'] = a[0];
            data['url'] = protocol.toLowerCase() + attack.headers['HOST'] + a[1];
            data['http-version'] = a[2];
        }
        data['headers'] = attack.headers;
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
        if (div.style.display === 'none') {
            div.style.display = ''
        }
    },

    renderTemplate: function(template,id_tag,data) {
        if (template === 'stepTemplate') {
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
            li.setAttribute('role','presentation');
            var a = document.createElement('a');
            a.setAttribute('data-toggle','pill');
            a.setAttribute('href','#'+step);
            a.innerHTML = data[step].step_name;
            li.appendChild(a);
            navHTML.appendChild(li);
        }

    },

    loadPage: function(){
        AppSpiderValidate.getEncodedHTTPRequest(function(data){
            data = AppSpiderValidate.transformAttacks('TEXTAREA', data);
            document.getElementById('appspider-nav').addEventListener('onload', AppSpiderValidate.renderNavTemplate(data));
            document.getElementById('step-template').addEventListener('onload', AppSpiderValidate.renderTemplate('stepTemplate','step-template', data));
        });
    },

    getEncodedHTTPRequest: function(callback) {
        AppSpiderValidate.sendMessage({
            type: 'getEncodedHTTPRequest'
        }, function(results){
            callback(results);
        });
    },
    /* Structure of message json */
    /*
    * message = {
    *   'type':'',
    *   'data': {} // optional
    * }
    * */
    sendMessage: function(message, callback){
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
                    data = AppSpiderValidate.parseRequest(decodedHeader);
                    AppSpiderValidate.storeAttack(data);
                    callback(data);
                    break;
            }
        });

    },

    saveAttack: function(from, attack_id, data) {
        switch (from.toUpperCase()){
            case 'RAW':
                var parsed_header = AppSpiderValidate.parseHeader(data);
                AppSpiderValidate.storeSingleAttack(attack_id,parsed_header);
                break;
            case 'PRETTIFY':
                break;
        }
    },

    storeSingleAttack: function(attack_id, attackData) {
        var attack_obj = {};
        attack_obj[attack_id] = attackData;
        chrome.storage.local.set(attack_obj, function(){
            console.log("Attack: "+ attack_id + " saved!!")
        });
    },

    storeAttack: function(attackData){
        if (!attackData){
            console.log('Error: Invalid Attack!!');
            return;
        }
        for (var attack_id in attackData){
            AppSpiderValidate.storeSingleAttack(attack_id,attackData[attack_id]);
        }
    },

    retrieveAttack: function(attack_id, callback) {
        chrome.storage.local.get(attack_id, function(results){
            console.log("Attack: " + attack_id + " found!" );
            callback(results[attack_id]);
        });
    },

    transformAttacks: function(type, attacks) {
        var transformedAttacks = {};
        switch(type.toUpperCase()){
            case 'TEXTAREA':
                for (var attack in attacks) {
                    transformedAttacks[attack] = {
                        step_id: attacks[attack].step_id,
                        step_name: attacks[attack].step_name,
                        attack_request_headers_textarea: AppSpiderValidateHelper.convertToString('JSON', attacks[attack].attack_request_header),
                        attack_payload: attacks[attack].attack_payload
                    };
                }
            default :
                break
        }
        return transformedAttacks;
    }
};

/* Event Handler */
document.addEventListener('onload', AppSpiderValidate.loadPage());
