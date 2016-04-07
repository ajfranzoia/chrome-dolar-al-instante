(function() {
  'use strict';

  angular.module('dbiPopup', [
    'angularMoment',
    'angularUtils.digitsOnly'
  ])

  .constant('config', {
    reviewUrl: '@@REVIEW_URL@@'
  })

  .run(function($rootScope, amMoment, provider) {

    // Set locale
    amMoment.changeLocale('es');

    // On browser events, broadcast them from $rootScope
    provider.on(function (event, data) {
      $rootScope.$broadcast(event, data);
    });

  });

})();
