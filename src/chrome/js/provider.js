(function (chrome, isNode) {
  'use strict';

  var ChromeProvider = {

    store: function (data, cb) {
      chrome.storage.local.set(data, cb);
    },

    get: function (key, cb) {
      chrome.storage.local.get(key, cb);
    },

    trigger: function (event, data) {
      chrome.runtime.sendMessage({event: event, data: data}, function() {});
    },

    on: function (event, handler) {
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
          if (typeof event === 'function') {
          // Global listener
          event(request.name, request.data);
        } else if (request.name === event) {
          // Defined event listener
          handler(request.data);
        }
      });
    },

    setIconInfo: function (title, value) {
      chrome.browserAction.setTitle({title: title});
      chrome.browserAction.setBadgeText({text: value});
    },

    setBadgeColor: function (color) {
      chrome.browserAction.setBadgeBackgroundColor({color: color});
    }

  };

  if (isNode) {
    module.exports = ChromeProvider;
  } else {
    angular.module('dbiPopup').service('provider', function createChromeProvider () {
      return ChromeProvider;
    });
  }

}(chrome, typeof module !== 'undefined' && module.exports));
