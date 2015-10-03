(function() {
  'use strict';

  function dbiRateRow() {
    return {
      restrict: 'A',
      replace: true,
      scope: { rate: '=' },
      templateUrl: '/js/popup/rate-row/template.html',
      controllerAs: 'vm',
      link: function link(scope, element, attrs) {
      }
    };
  }

  angular.module('dbiPopup').directive('dbiRateRow', dbiRateRow);

})();
