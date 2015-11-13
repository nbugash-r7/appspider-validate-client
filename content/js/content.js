/**
 * Created by nbugash on 10/11/15.
 */
/* Hard coding the encoded HTTP request for now */
//var encodedHTTPRequest = "R0VUIC9kYXRhc3RvcmUvZ2V0aW1hZ2VfYnlfaWQucGhwP2lkPTggSFRUUC8xLjENCkFjY2VwdDogdGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksKi8qO3E9MC44DQpBY2NlcHQtQ2hhcnNldDogKg0KQWNjZXB0LUVuY29kaW5nOiBnemlwLCBkZWZsYXRlDQpVc2VyLUFnZW50OiBNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgTVNJRSA5LjA7IFdpbmRvd3MgTlQgNi4xOyBXT1c2NDsgVHJpZGVudC81LjApDQpIb3N0OiB3d3cud2Vic2NhbnRlc3QuY29tDQpSZWZlcmVyOiBodHRwOi8vd3d3LndlYnNjYW50ZXN0LmNvbS9zaHV0dGVyZGIvc2VhcmNoX2dldF9ieV9pZDIucGhwP2lkPTYNCkNvb2tpZTogbGFzdF9zZWFyY2g9MzsgU0VTU0lPTklEX1ZVTE5fU0lURT1wM2VtMnRwYXMzYmxkb3I0dWM4cmJjMDJoNTsgVEVTVF9TRVNTSU9OSUQ9cmRkamc0aDJjOHJiOGRndDJoNWE1YXI0MjA7IGZpcnN0bmFtZT1Kb2huDQoNCiNBI0IjQyNEI0UjRiNHI0gjClRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyIHZhbHVlcyB3ZXJlIHN1Ym1pdHRlZCB0byB0ZXN0IGZvciB0aGlzIHZ1bG5lcmFiaWxpdHk6CiMxLCBQYXNzZWQ6IDggLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIGRpZmZlcmVudCBmcm9tIHRoZSBvcmlnaW5hbC4gQWx0ZXJuYXRlIHZhbHVlLgojMiwgUGFzc2VkOiAzKzMgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzMsIFBhc3NlZDogNCs0IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgojNCwgUGFzc2VkOiAyKzQgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzUsIFBhc3NlZDogMys1IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgoNClZ1bG5lcmFibGUgYXJlYXMgaW4gdGhlIHJlc3BvbnNlcyBhcmUgbm90IGhpZ2hsaWdodGVkOiBPcmlnaW5hbCBSZXNwb25zZSBpcyBCaW5hcnkgKGRlZmluZWQgYnkgY29udGVudC10eXBlKQojSCNHI0YjRSNEI0MjQiNBIwpHRVQgL2RhdGFzdG9yZS9nZXRpbWFnZV9ieV9pZC5waHA/aWQ9MyUyQjMgSFRUUC8xLjENCkFjY2VwdDogdGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksKi8qO3E9MC44DQpBY2NlcHQtQ2hhcnNldDogKg0KQWNjZXB0LUVuY29kaW5nOiBnemlwLCBkZWZsYXRlDQpVc2VyLUFnZW50OiBNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgTVNJRSA5LjA7IFdpbmRvd3MgTlQgNi4xOyBXT1c2NDsgVHJpZGVudC81LjApDQpIb3N0OiB3d3cud2Vic2NhbnRlc3QuY29tDQpSZWZlcmVyOiBodHRwOi8vd3d3LndlYnNjYW50ZXN0LmNvbS9zaHV0dGVyZGIvc2VhcmNoX2dldF9ieV9pZDIucGhwP2lkPTYNCkNvb2tpZTogbGFzdF9zZWFyY2g9MzsgU0VTU0lPTklEX1ZVTE5fU0lURT1wM2VtMnRwYXMzYmxkb3I0dWM4cmJjMDJoNTsgVEVTVF9TRVNTSU9OSUQ9cmRkamc0aDJjOHJiOGRndDJoNWE1YXI0MjA7IGZpcnN0bmFtZT1Kb2huDQoNCiNBI0IjQyNEI0UjRiNHI0gjClRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyIHZhbHVlcyB3ZXJlIHN1Ym1pdHRlZCB0byB0ZXN0IGZvciB0aGlzIHZ1bG5lcmFiaWxpdHk6CiMxLCBQYXNzZWQ6IDggLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIGRpZmZlcmVudCBmcm9tIHRoZSBvcmlnaW5hbC4gQWx0ZXJuYXRlIHZhbHVlLgojMiwgUGFzc2VkOiAzKzMgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzMsIFBhc3NlZDogNCs0IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgojNCwgUGFzc2VkOiAyKzQgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzUsIFBhc3NlZDogMys1IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgoNClZ1bG5lcmFibGUgYXJlYXMgaW4gdGhlIHJlc3BvbnNlcyBhcmUgbm90IGhpZ2hsaWdodGVkOiBPcmlnaW5hbCBSZXNwb25zZSBpcyBCaW5hcnkgKGRlZmluZWQgYnkgY29udGVudC10eXBlKQojSCNHI0YjRSNEI0MjQiNBIwpHRVQgL2RhdGFzdG9yZS9nZXRpbWFnZV9ieV9pZC5waHA/aWQ9NCUyQjQgSFRUUC8xLjENCkFjY2VwdDogdGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksKi8qO3E9MC44DQpBY2NlcHQtQ2hhcnNldDogKg0KQWNjZXB0LUVuY29kaW5nOiBnemlwLCBkZWZsYXRlDQpVc2VyLUFnZW50OiBNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgTVNJRSA5LjA7IFdpbmRvd3MgTlQgNi4xOyBXT1c2NDsgVHJpZGVudC81LjApDQpIb3N0OiB3d3cud2Vic2NhbnRlc3QuY29tDQpSZWZlcmVyOiBodHRwOi8vd3d3LndlYnNjYW50ZXN0LmNvbS9zaHV0dGVyZGIvc2VhcmNoX2dldF9ieV9pZDIucGhwP2lkPTYNCkNvb2tpZTogbGFzdF9zZWFyY2g9MzsgU0VTU0lPTklEX1ZVTE5fU0lURT1wM2VtMnRwYXMzYmxkb3I0dWM4cmJjMDJoNTsgVEVTVF9TRVNTSU9OSUQ9cmRkamc0aDJjOHJiOGRndDJoNWE1YXI0MjA7IGZpcnN0bmFtZT1Kb2huDQoNCiNBI0IjQyNEI0UjRiNHI0gjClRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyIHZhbHVlcyB3ZXJlIHN1Ym1pdHRlZCB0byB0ZXN0IGZvciB0aGlzIHZ1bG5lcmFiaWxpdHk6CiMxLCBQYXNzZWQ6IDggLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIGRpZmZlcmVudCBmcm9tIHRoZSBvcmlnaW5hbC4gQWx0ZXJuYXRlIHZhbHVlLgojMiwgUGFzc2VkOiAzKzMgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzMsIFBhc3NlZDogNCs0IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgojNCwgUGFzc2VkOiAyKzQgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzUsIFBhc3NlZDogMys1IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgoNClZ1bG5lcmFibGUgYXJlYXMgaW4gdGhlIHJlc3BvbnNlcyBhcmUgbm90IGhpZ2hsaWdodGVkOiBPcmlnaW5hbCBSZXNwb25zZSBpcyBCaW5hcnkgKGRlZmluZWQgYnkgY29udGVudC10eXBlKQojSCNHI0YjRSNEI0MjQiNBIwpHRVQgL2RhdGFzdG9yZS9nZXRpbWFnZV9ieV9pZC5waHA/aWQ9MiUyQjQgSFRUUC8xLjENCkFjY2VwdDogdGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksKi8qO3E9MC44DQpBY2NlcHQtQ2hhcnNldDogKg0KQWNjZXB0LUVuY29kaW5nOiBnemlwLCBkZWZsYXRlDQpVc2VyLUFnZW50OiBNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgTVNJRSA5LjA7IFdpbmRvd3MgTlQgNi4xOyBXT1c2NDsgVHJpZGVudC81LjApDQpIb3N0OiB3d3cud2Vic2NhbnRlc3QuY29tDQpSZWZlcmVyOiBodHRwOi8vd3d3LndlYnNjYW50ZXN0LmNvbS9zaHV0dGVyZGIvc2VhcmNoX2dldF9ieV9pZDIucGhwP2lkPTYNCkNvb2tpZTogbGFzdF9zZWFyY2g9MzsgU0VTU0lPTklEX1ZVTE5fU0lURT1wM2VtMnRwYXMzYmxkb3I0dWM4cmJjMDJoNTsgVEVTVF9TRVNTSU9OSUQ9cmRkamc0aDJjOHJiOGRndDJoNWE1YXI0MjA7IGZpcnN0bmFtZT1Kb2huDQoNCiNBI0IjQyNEI0UjRiNHI0gjClRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyIHZhbHVlcyB3ZXJlIHN1Ym1pdHRlZCB0byB0ZXN0IGZvciB0aGlzIHZ1bG5lcmFiaWxpdHk6CiMxLCBQYXNzZWQ6IDggLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIGRpZmZlcmVudCBmcm9tIHRoZSBvcmlnaW5hbC4gQWx0ZXJuYXRlIHZhbHVlLgojMiwgUGFzc2VkOiAzKzMgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzMsIFBhc3NlZDogNCs0IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgojNCwgUGFzc2VkOiAyKzQgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzUsIFBhc3NlZDogMys1IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgoNClZ1bG5lcmFibGUgYXJlYXMgaW4gdGhlIHJlc3BvbnNlcyBhcmUgbm90IGhpZ2hsaWdodGVkOiBPcmlnaW5hbCBSZXNwb25zZSBpcyBCaW5hcnkgKGRlZmluZWQgYnkgY29udGVudC10eXBlKQojSCNHI0YjRSNEI0MjQiNBIwpHRVQgL2RhdGFzdG9yZS9nZXRpbWFnZV9ieV9pZC5waHA/aWQ9MyUyQjUgSFRUUC8xLjENCkFjY2VwdDogdGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksKi8qO3E9MC44DQpBY2NlcHQtQ2hhcnNldDogKg0KQWNjZXB0LUVuY29kaW5nOiBnemlwLCBkZWZsYXRlDQpVc2VyLUFnZW50OiBNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgTVNJRSA5LjA7IFdpbmRvd3MgTlQgNi4xOyBXT1c2NDsgVHJpZGVudC81LjApDQpIb3N0OiB3d3cud2Vic2NhbnRlc3QuY29tDQpSZWZlcmVyOiBodHRwOi8vd3d3LndlYnNjYW50ZXN0LmNvbS9zaHV0dGVyZGIvc2VhcmNoX2dldF9ieV9pZDIucGhwP2lkPTYNCkNvb2tpZTogbGFzdF9zZWFyY2g9MzsgU0VTU0lPTklEX1ZVTE5fU0lURT1wM2VtMnRwYXMzYmxkb3I0dWM4cmJjMDJoNTsgVEVTVF9TRVNTSU9OSUQ9cmRkamc0aDJjOHJiOGRndDJoNWE1YXI0MjA7IGZpcnN0bmFtZT1Kb2huDQoNCiNBI0IjQyNEI0UjRiNHI0gjClRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyIHZhbHVlcyB3ZXJlIHN1Ym1pdHRlZCB0byB0ZXN0IGZvciB0aGlzIHZ1bG5lcmFiaWxpdHk6CiMxLCBQYXNzZWQ6IDggLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIGRpZmZlcmVudCBmcm9tIHRoZSBvcmlnaW5hbC4gQWx0ZXJuYXRlIHZhbHVlLgojMiwgUGFzc2VkOiAzKzMgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzMsIFBhc3NlZDogNCs0IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgojNCwgUGFzc2VkOiAyKzQgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzUsIFBhc3NlZDogMys1IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgoNClZ1bG5lcmFibGUgYXJlYXMgaW4gdGhlIHJlc3BvbnNlcyBhcmUgbm90IGhpZ2hsaWdodGVkOiBPcmlnaW5hbCBSZXNwb25zZSBpcyBCaW5hcnkgKGRlZmluZWQgYnkgY29udGVudC10eXBlKQ==";

/* LIST of XPath */
var vuln_types = '/html/body/div/table[3]/tbody/tr/td/table/tbody';
var vuln_report = '/html/body/div/div[1]/h1';
var attack_lists = "/html/body/div";

var results;

var all_vuln_types = [];

/* (1) Parse through the page */
var vulnerabilitysection = document.evaluate(vuln_report, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
if (vulnerabilitysection.snapshotItem(0)){
    var page_title = vulnerabilitysection.snapshotItem(0).textContent;
    /* (2) Check if this is a Vulnerabilities Report Page */
    if (page_title.match(/(Vulnerabilities Report)/)) {
        alert("This is a Vulnerabilities Report");
        /* TODO: (3) Parse through the page for the encoded http request */

        /* Get all vuln type */
        results = document.evaluate(vuln_types, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
        if (results.snapshotItem(0)) {
            results = results.snapshotItem(0).children;
            for (var i = 1; i < results.length; i++) {
                var attk = results[i].children;
                if (attk.length > 0) {
                    var type = attk[0].innerText;
                    if (!type.match(/total/i)){
                        all_vuln_types.push(type);
                    }
                }
            }
        }

        results = document.evaluate(attack_lists, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
        if (results.snapshotItem(0)){
            results = results.snapshotItem(0).children;
            for (i = 0; i < results.length; i++) {

            }

        }
        //var attack_types = results.snapshotItem(0).getElementsByClassName("border_lightgrey"); /* HTMLCollection */
        //if (attack_types) {
        //    for (var i = 0; i < attack_types.length; i++) {
        //        if
        //    }
        //}




        var all_imagestags = document.getElementsByTagName('img'); // Type: HTMLCollections[]
        /* (3.1) For each image tag get all image with id ~= BUTTON_vuln_group_ */
        for (i = 0; i < all_imagestags.length; i++ ){
            /* (3.2) For each tag get the nodeValue of the onmousedown */
            var imagedoc = all_imagestags[i];
            if (imagedoc.id.match(/button_vuln_group_/i)){
                /* (3.3) Parse the result so that we can obtain the encodedHTTPRequest */
                var attributes = imagedoc.attributes.onmousedown.nodeValue.split(',');
                var encodedHTTPRequest = attributes[attributes.length -1].slice(2,-3);
                alert('Sending encodedHTTPRequest ' + encodedHTTPRequest );
                chrome.runtime.sendMessage({
                    type: "encodedHTTPRequest",
                    data: {
                        encodedHTTPRequest: encodedHTTPRequest
                    }
                }, function(response){
                    console.log(response.farewell);
                });

                //Temporary break
                alert('Sent');
                break;
            }
        }
    }
};

