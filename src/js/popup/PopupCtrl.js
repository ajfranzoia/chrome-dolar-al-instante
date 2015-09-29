(function() {
  'use strict';

  function PopupCtrl($scope, $timeout, RatesService) {
    var vm = this;

    vm.rates = [];
    vm.gap = null;
    vm.lastUpdated = null;

    // Set up events listeners and display rates
    setupListeners();
    RatesService.get(updateRates);

    /**
     * Set up controller events.
     * Registers rates updated listener.
     *
     * @return {undefined}
     */
    function setupListeners() {
      // Listen to rates update
      var ratesUpdatedListener = $scope.$on('rates:updated', function() {
        RatesService.get(updateRates);
      });

      // Deregister rates update listener on destroy
      $scope.$on('$destroy', ratesUpdatedListener);
    }

    /**
     * Updates displayed rates.
     * Prepares view vars and calculates gap between blue/oficial.
     *
     * @param  {Array} rates Array of rates info
     * @return {undefined}
     */
    function updateRates(rates) {
      if (typeof rates !== 'undefined' && rates !== null) {
        vm.rates = [
          {
            name: 'Blue',
            sell: rates.blue.sell,
            buy: rates.blue.buy,
            variation: rates.blue.variation,
            icon: 'money'
          },
          {
            name: 'Oficial',
            sell: rates.oficial.sell,
            buy: rates.oficial.buy,
            variation: rates.oficial.variation,
            icon: 'money'
          },
          {
            name: 'Ahorro (+20%)',
            sell: rates.oficial.sell * 1.20,
            icon: 'inbox'
          },
          {
            name: 'Tarjeta (+35%)',
            sell: rates.oficial.sell * 1.35,
            icon: 'globe'
          },
        ];

        // Blue/oficial gap = ((blue - oficial) / oficial) %
        vm.gap = ((rates.blue.sell - rates.oficial.sell) / (rates.oficial.sell * 1.0)) * 100;
        vm.lastUpdated = rates.date;
      }

      // Apply changes to view
      $timeout(function() {
        $scope.$apply();
      });
    }
  }

  angular.module('popup').controller('PopupCtrl', PopupCtrl);

})();
