(function() {
  'use strict';

  function dbiRateRow() {
    return {
      restrict: 'A',
      replace: true,
      scope: { rate: '=', converters: '=' },
      templateUrl: '/js/popup/rate-row/template.html',
      controllerAs: 'vm',
      link: function link(scope, el, attrs) {
      }
    };
  }

  angular.module('dbiPopup').directive('dbiRateRow', dbiRateRow);

})();
