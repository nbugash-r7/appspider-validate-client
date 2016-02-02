/**
 * Created by nbugash on 12/01/16.
 */
/* Hard coding the encoded HTTP request for now */

/* LIST of XPath */
var VULN_REPORT = "/html/body/div/div[1]/h1";

document.addEventListener('click', function(e){
    var results = document.evaluate(VULN_REPORT, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    if (results.snapshotItem(0)) {
        var page_title = results.snapshotItem(0).textContent;
        if (page_title.match(/(Vulnerabilities Report)/)) {
            //console.log("This is a Vulnerabilities Report");
            var srcElement = e.srcElement;
            if (srcElement.attributes.onmousedown && srcElement.attributes.onmousedown.value) {
                var attributes = srcElement.attributes.onmousedown.value;
                attributes = attributes.split(" ");
                var encodedHTTPRequest = attributes[attributes.length -1].slice(1,-3);
                if (encodedHTTPRequest){
                    chrome.runtime.sendMessage({
                        type: "save_encoded_http_request",
                        from: "content.js",
                        data: {
                            encodedHTTPRequest: encodedHTTPRequest
                        }
                    });
                    chrome.runtime.sendMessage({
                        type: "parse_and_save_http_request",
                        from: "content.js"
                    });
                    chrome.runtime.sendMessage({
                        type: "open_validate_page",
                        from: "content.js"
                    });
                }
            }
        }
    }

}, false);