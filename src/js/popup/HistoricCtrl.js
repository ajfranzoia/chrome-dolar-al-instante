(function() {
  'use strict';

  function HistoricCtrl($scope, $timeout, RatesService, chrome) {
    var vm = this;

    vm.loaded = false;
    vm.sampleSize = 20; //items per page
    vm.currentPage = 1;
    vm.maxPage = 1;
    vm.type = 'oficial'; //currency type value
    vm.series = ['Compra', 'Venta'];

    /**
     * Makes an API call specifying the offset (pageSize * (current - 1))
     * and the currency type
     * @param  {Integer} page Page number
     * @return {undefined}
     */
    vm.fetch = function(page) {
      vm.currentPage = page;
      vm.loaded = false;

      RatesService.getHistoric(vm.type, vm.sampleSize * (vm.currentPage - 1))
        .then(updateDisplayedRates)
        .catch(function(err) {
          console.log('La concha de Gerling');
        });
    };

    /**
     * Updates displayed historic rates.
     *
     * @param  {Object} results API response with rows and total records
     * @return {undefined}
     */
    function updateDisplayedRates(results) {
      vm.labels = [];
      vm.data = [[], []];
      vm.maxPage = Math.ceil(results.count / vm.sampleSize);

      angular.forEach(results.rows, function(data) {
        vm.labels.unshift(formatDate(data.date));
        vm.data[0].unshift(data.buy);
        vm.data[1].unshift(data.sell);
      });

      vm.loaded = true;

      // Apply changes to view
      $timeout(function() {
        $scope.$apply();
      });
    }

    /**
     * Returns a string to display the date DD/MM
     *
     * @param  {String} date
     * @return {String}
     */
    function formatDate(date) {
      date = new Date(date);
      return String(date.getDate()) + '/' + String(date.getMonth() + 1);
    }

    vm.fetch(1);
  }

  angular.module('dbiPopup').controller('HistoricCtrl', HistoricCtrl);

})();
