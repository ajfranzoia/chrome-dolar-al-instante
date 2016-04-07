(function() {
  'use strict';

  /**
   * Dollars to pesos conversion widget directive
   *
   * @return {undefined}
   */
  function dbiConverter() {
    return {
      restrict: 'AE',
      scope: { price: '=' },
      templateUrl: '/js/popup/converter/template.html',
      link: function link(scope, element, attrs) {
        element.addClass('dbi-converter');
      },
      controllerAs: 'vm',
      controller: function($scope) {
        var vm = this;
        var price = $scope.price;

        vm.editDollars = editDollars;
        vm.editPesos = editPesos;

        function editDollars() {
          vm.pesos = vm.dollars ? Math.round(vm.dollars * price) : null;
        }

        function editPesos() {
          vm.dollars = vm.pesos ? Math.round(vm.pesos / price) : null;
        }
      }
    };
  }

  angular.module('dbiPopup').directive('dbiConverter', dbiConverter);

})();
