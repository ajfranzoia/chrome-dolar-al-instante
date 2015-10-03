(function() {
  'use strict';

  angular.module('dbiPopup', [
    'angularMoment',
    'angularUtils.digitsOnly'
  ])

  .run(function($rootScope, amMoment) {

    // Set locale
    amMoment.changeLocale('es');

    // On Chrome messages, broadcast from $rootScope with the "request.event" param as the event name
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      request.cb = sendResponse;
      $rootScope.$broadcast(request.event, request);
    });

  });

})();
