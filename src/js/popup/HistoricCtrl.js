(function() {
  'use strict';

  function HistoricCtrl($scope, $timeout, RatesService, chrome) {
    var vm = this;

    vm.loaded = false;

    RatesService.getHistoric(updateDisplayedRates);

    /**
     * Updates displayed historic rates.
     * Prepares view vars for the graphic. Gdo
     *
     * @param  {Array} rates Array of rates through history
     * @return {undefined}
     */
    function updateDisplayedRates(rates) {
      vm.labels = [];
      vm.series = ['Compra', 'Venta'];
      vm.data = [[], []];

      for(var i = rates.length - 1; i >= 0 &&  i >= rates.length - 20; i--) {
        vm.labels.push(rates[i].date);
        vm.data[0].push(rates[i].buy);
        vm.data[1].push(rates[i].sell);
      }
      vm.loaded = true;

      // Apply changes to view
      $timeout(function() {
        $scope.$apply();
      });
    }
  }

  angular.module('dbiPopup').controller('HistoricCtrl', HistoricCtrl);

})();
