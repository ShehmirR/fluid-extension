let buttonStatus = false;
let sendData;
var bkg = chrome.extension.getBackgroundPage();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "buttonStatus" ) {
            buttonStatus = request.status;
        }
    }
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        let headers = {}
        if(details.method == "POST" && buttonStatus) {
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'User-Agent') {
                    for (var header of details.requestHeaders) {
                        headers[header.name] = header.value;
                    }
                    break;
                }
            }
            sendData["headers"] = headers;
            bkg.console.log(sendData)
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, {"message": "sent_login"});
            });
            return { cancel: true };
        }
    },
    {urls: ['<all_urls>']},
    ['blocking', 'requestHeaders']
);

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if(details.method == "POST" && buttonStatus) {
            sendData = {};
            var postedString = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes)));
            sendData['device_info'] = JSON.parse(postedString)['device_info']
            //eturn {cancel: true}
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestBody"]
);