(function () {
    "use strict";

    window.InfoSocket = {
        _sock: null,
        _protocol: "ws://",
        _socketProtocol: "kc",
        _ip: "localhost",
        _port: "8082",
        _customUrl: "",
        _forsedClose: false,
        _reconnectAttemptsCount: 0,

        reconnect: function () {
            const self = this;

            if (this._reconnectAttemptsCount < 3) {
                this.connect();
            } else if (this._reconnectAttemptsCount < 15) {
                //once per 5 seconds
                setTimeout(function () {
                    self.connect();
                }, 5000);
            } else {
                //once per minute
                setTimeout(function () {
                    self.connect();
                }, 60000);
            }
        },

        onmessage: function (message) {
            console.log("Socket. received new message: " + message.data);
            window.eval(message.data);
        },

        connect: function () {
            if (this._sock != null && this._sock.readyState == this._sock.OPEN)
                return;

            const self = this;
            console.log("Connecting... try #" + ++self._reconnectAttemptsCount);
            //only wss is allowed since we are going "outside"
            try{
                let socket = new WebSocket(this._protocol + this._ip + ":" + this._port + this._customUrl, this._socketProtocol);
                socket.onopen = function () {
                    console.log("Socket open success.");
                    self._reconnectAttemptsCount = 0;
                };

                socket.onmessage = function (message) {
                    self.onmessage(message);
                };

                socket.onclose = function () {
                    if (self._forsedClose)
                        return;
                    self.stopLogging();
                    self.reconnect();
                };

                self._sock = socket;
            } catch (e){
                self._sock = null;
            }
            return this;
        },
        logRequest: function (request) {
            if (window.InfoSocket._sock === null || window.InfoSocket._sock.readyState !== WebSocket.OPEN)
                return;

            const self = window.InfoSocket;
            if (request.response.content.mimeType.indexOf("text") === -1)
                return;

            let data = {
                url: request.request.url,
                method: request.request.method,
                timings: request.timings,
                startedDateTime: request.startedDateTime
            };

            if (typeof request.request.postData !== "undefined")
                data.postData = request.request.postData;

            request.getContent(function (responseBody) {
                if (responseBody.indexOf("svdata=") > -1) {
                    responseBody = responseBody.substring(7);
                }
                data.responseBody = responseBody;
                console.debug("sended", request, data);
                self._sock.send(JSON.stringify(data));
            });
        },
        startLogging: function () {
            this.stopLogging();
            chrome.devtools.network.onRequestFinished.addListener(this.logRequest);
        },
        stopLogging: function () {
            chrome.devtools.network.onRequestFinished.removeListener(this.logRequest);
        },
        dataUriToBlob: function(dataURI) {
            const byteString = atob(dataURI.split(",")[1]);

            const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]

            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], {type: mimeString});
            return blob;
        }
    };
    window.InfoSocket.connect();
})();