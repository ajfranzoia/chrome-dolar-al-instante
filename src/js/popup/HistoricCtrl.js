(function() {
  'use strict';

  function HistoricCtrl($scope, $timeout, RatesService, chrome) {
    var vm = this;

    vm.loaded = false;
    vm.sampleSize = 20;
    vm.currentPage = 1;
    vm.maxPage = 1;
    vm.rates = [];

    RatesService.getHistoric(updateDisplayedRates);

    /**
     * Updates displayed historic rates.
     * Calls the paginate function in page 1
     *
     * @param  {Array} rates Array of rates through history
     * @return {undefined}
     */
    function updateDisplayedRates(rates) {
      vm.rates = rates;
      //pagination goes in the opposite logical direction in order to show the latest values first
      vm.maxPage = Math.ceil(rates.length / vm.sampleSize);
      vm.paginate(1);
    }

    /**
     * Updates the graph showing a paginated portion of the stored historic data
     *
     * @param  {Int} Page number
     * @return {undefined}
     */
    vm.paginate = function(page) {
      vm.currentPage = page;
      vm.labels = [];
      vm.series = ['Compra', 'Venta'];
      vm.data = [[], []];

      var to = vm.rates.length - (20 * (page - 1));
      var from = to - 20 >= 0 ? to - 20 : 0;
      var sample = vm.rates.slice(from, to);

      angular.forEach(sample, function(data) {
        vm.labels.push(data.date);
        vm.data[0].push(data.buy);
        vm.data[1].push(data.sell);
      });

      vm.loaded = true;

      // Apply changes to view
      $timeout(function() {
        $scope.$apply();
      });
    };
  }

  angular.module('dbiPopup').controller('HistoricCtrl', HistoricCtrl);

})();
