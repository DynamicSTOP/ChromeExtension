/**
 * Credit for KC3Kai team!
 * https://github.com/KC3Kai/KC3Kai
 */

(function(){
	"use strict";
	
	console.info("Messengers loaded");
	
	/* RUNTIME MESSAGE
	Send message to all components, which will only execute on "target"
	------------------------------------------*/
	window.IS_RMsg = function(target, action, params, callback){
		// Compile params with required fields and sender's own data
		this.params = $.extend({
			identifier: "IS_"+target,
			action: action
		}, params);
		
		// Save callback for later
		this.callback = (callback || function(){});
		
		return true; // for async callbacks
	};

    IS_RMsg.prototype.execute = function(){
		// Execute required Chrome APIs
		chrome.runtime.sendMessage(this.params, this.callback);
		return true; // for async callbacks
	};
	
	/* TAB MESSAGE
	Send message to a specific Chrome tab
	------------------------------------------*/
	window.IS_TMsg = function(tabId, target, action, params, callback){
		// Remember tabId to send it to
		this.tabId = tabId;
		
		// Compile params with required fields and sender's own data
		this.params = $.extend({
			identifier: "IS_"+target,
			action: action
		}, params);
		
		// Save callback for later
		this.callback = (callback || function(){});
		
		return true; // for async callbacks
	};

    IS_TMsg.prototype.execute = function(){
		// Execute required Chrome APIs
		chrome.tabs.sendMessage(this.tabId, this.params, this.callback);
		return true; // for async callbacks
	};
	
})();