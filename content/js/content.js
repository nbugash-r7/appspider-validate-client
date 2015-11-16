/**
 * Created by nbugash on 10/11/15.
 */
/* Hard coding the encoded HTTP request for now */

/* LIST of XPath */
var vuln_report = '/html/body/div/div[1]/h1';

document.addEventListener('click', function(e){
    var vulnerabilitysection = document.evaluate(vuln_report, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    if (vulnerabilitysection.snapshotItem(0)) {
        var page_title = vulnerabilitysection.snapshotItem(0).textContent;
        if (page_title.match(/(Vulnerabilities Report)/)) {
            console.log("This is a Vulnerabilities Report");
            var srcElement = e.srcElement;
            if (srcElement.attributes.onmousedown && srcElement.attributes.onmousedown.value) {
                var attributes = srcElement.attributes.onmousedown.value;
                attributes = attributes.split(" ");
                var encodedHTTPRequest = attributes[attributes.length -1].slice(1,-3);
                if (encodedHTTPRequest){
                    console.log('Sending encodedHTTPRequest ' + encodedHTTPRequest );
                    chrome.runtime.sendMessage({
                        type: "encodedHTTPRequest",
                        data: {
                            encodedHTTPRequest: encodedHTTPRequest
                        }
                    }, function(response){
                        console.log(response.farewell);
                    });
                }
            }
        }
    }

}, false);
