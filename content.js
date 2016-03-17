/**
 * Created by nbugash on 12/01/16.
 */
/* Hard coding the encoded HTTP request for now */

/* LIST of XPath */
var VULN_REPORT = "/html/body/div/div[1]/h1";

document.addEventListener('click', function (e) {
	var results = document.evaluate(VULN_REPORT, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (results.snapshotItem(0)) {
		var srcElement = e.srcElement;
		if (srcElement.attributes.onmousedown && srcElement.attributes.onmousedown.value) {
			var attributes = srcElement.attributes.onmousedown.value;
			if(attributes.match(/appletstart/i)){
				attributes = attributes.split(" ");
				var encodedHTTPRequest = attributes[attributes.length - 1].slice(1, -3);
				if (encodedHTTPRequest) {
					chrome.runtime.sendMessage({
						type: 'run_validate_page',
						from: 'content.js',
						data: {
							storage_type: 'local', //storage_type: local or sync
							encodedHTTPRequest: encodedHTTPRequest,
							send_request_as: 'xmlhttprequest' // send_request_as: xmlhttprequest or ajax
						}
					});
				}
			}
		}
	}

}, false);