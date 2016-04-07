(function (isNode) {
  'use strict';

  var ss = require("sdk/simple-storage");
  var buttons = require('sdk/ui/button/action');

  var FirefoxProvider = {

    store: function (data, cb) {
      var key;
      for (key in data) {}
      ss.storage.key = data[key];
      cb();
    },

    get: function (key, cb) {
      cb(ss.storage.key);
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
      var button = buttons.ActionButton({
        id: "mozilla-link",
        label: "Visit Mozilla",
        icon: {
          "16": "./icon-16.png",
          "32": "./icon-32.png",
          "64": "./icon-64.png"
        },
        onClick: function () { }
      });


      //chrome.browserAction.setTitle({title: title});
      //chrome.browserAction.setBadgeText({text: value});
    },

    setBadgeColor: function (color) {
      //chrome.browserAction.setBadgeBackgroundColor({color: color});
    }

  };

  if (isNode) {
    module.exports = FirefoxProvider;
  } else {
    angular.module('dbiPopup').service('provider', function createFirefoxProvider () {
      return FirefoxProvider;
    });
  }

}(typeof module !== 'undefined' && module.exports));
