console.log("IS started");

chrome.runtime.onMessage.addListener(function (request, sender, response) {
    if (request.identifier != "IS_IS") return true;
    if (typeof request.url !== "undefined" && window.location.href !== request.url) return true;
    if (typeof request.action == "undefined") return true;


    switch (request.action) {
        case "getWinParams":
            response({
                availHeight: window.screen.availHeight,
                availLeft: window.screen.availLeft,
                availTop: window.screen.availTop,
                availWidth: window.screen.availWidth,
                height: window.screen.height,
                width: window.screen.width,
                screenX: window.screenX,
                screenY: window.screenY,
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight,
                offset: $("#game_frame").offset()
            });
            break;
        case "execCommand":
            response(eval(request.execCommand));
            break;

        case "getGamescreenOffset":
                response($("#area-game").offset());
            break;

        default:
            console.debug("unknown action in request", request);
            break;
    }
});