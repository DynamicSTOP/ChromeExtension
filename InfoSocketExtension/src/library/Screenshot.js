function Screenshot(){
    this.canvas = {};
    this.context = {};
    this.domImg = {};
    this.callback = function(){};
}

Screenshot.prototype.setCallback = function(callback){
    this.callback = callback;
    return this;
};

Screenshot.prototype.prepare = function(){
    // Initialize HTML5 Canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = 800;
    this.canvas.height = 480;
    this.context = this.canvas.getContext("2d");

    // Initialize Image Tag
    this.domImg = new Image();
};

Screenshot.prototype.remoteStart = function(tabId, offset){
    this.tabId = tabId;
    this.offset = offset;
    this.prepare();
    this.remoteCapture();
};

Screenshot.prototype.remoteCapture = function(){
    var self = this;
    chrome.tabs.get(this.tabId, function(tabInfo){
        chrome.tabs.captureVisibleTab(tabInfo.windowId, {
            format: "png",
            quality: 100
        }, function(base64img){
            self.domImg.onload = function(){self.crop(self.offset)};
            self.domImg.src = base64img;
        });
    });
};

Screenshot.prototype.crop = function(offset){
    this.context.drawImage(
        this.domImg,
        offset.left ,
        offset.top ,
        800,
        480,
        0,
        0,
        800,
        480
    );
    this.output();
};
