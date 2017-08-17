console.log("Loaded InfoSocket Service");


/* Runtime Message Listener
 https://developer.chrome.com/extensions/messaging#simple
 This script will wait for messages from other parts of the extension
 and execute what they want if applicable
 ------------------------------------------*/
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    // Check if message is intended for this script
    if ((request.identifier || false) == "IS_infosocketService") {
        // Log message contents and sender for debugging
        console.log(request.action, {"Request": request, "Sender": sender});

        // Check requested action is supported
        if (typeof window.InfoSocketService[request.action] != "undefined") {
            // Execute and pass callback to function
            window.InfoSocketService[request.action](request, sender, callback);
            return true; // dual-async response
        } else {
            // Unknown action
            callback({success: false});
        }

    }
});

window.InfoSocketService = {
    "screenshot": function (request, sender, response) {
        var senderUrl = sender.url || sender.tab.url || "";
        // If devtools, a tab ID should be in the request param
        if (isDevtools(senderUrl)) {
            // Get tab information to get URL of requester
            chrome.tabs.get(request.tabId, function (tabDetails) {
                // If not API or DMM Frame, must be special mode
                screenshotSpecialMode(request.tabId, response);
                return true;
            });
        } else {
            response({value: false});
        }
        return true;
    },
    "getWinParams": function(request,sender,response) {
        (new IS_TMsg(request.tabId, "IS", "getWinParams", {}, function(ISResponse){
            response(ISResponse);
        })).execute();
    },
    "execCommand": function(request,sender,response){
        (new IS_TMsg(request.tabId, "IS", "execCommand", {execCommand:request.execCommand},
            function(ISResponse){
                response(ISResponse);
            })
        ).execute();
    }
};


function isDevtools(url){
    return url.indexOf("/pages/devtools") > -1;
}

function screenshotSpecialMode(tabId, response){
    (new IS_TMsg(tabId, "IS", "getGamescreenOffset", {}, function(offset){
        let s = new Screenshot();
            s.setCallback(response);
            s.output=function(){
                response(s.canvas.toDataURL("image/png",20));
            };
            s.remoteStart(tabId, offset);
    })).execute();
}