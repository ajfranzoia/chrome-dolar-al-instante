(function() {
  'use strict';

  angular.module('dbiPopup', [
    'angularMoment',
    'angularUtils.digitsOnly'
  ])

  .constant('config', {
    reviewUrl: '@@REVIEW_URL@@'
  })

  .run(["$rootScope", "amMoment", "provider", function($rootScope, amMoment, provider) {

    // Set locale
    amMoment.changeLocale('es');

    // On browser events, broadcast them from $rootScope
    provider.on(function (event, data) {
      $rootScope.$broadcast(event, data);
    });

  }]);

})();

(function() {
  'use strict';

  function PopupCtrl($scope, $timeout, RatesService, config) {
    var vm = this;

    vm.mode = '';
    vm.rates = [];
    vm.gap = null;
    vm.lastUpdated = null;
    vm.calculatorMode = false;
    vm.loaded = loaded;
    vm.refreshRates = refreshRates;
    vm.refreshing = false;
    vm.reviewUrl = config;

    // Set up events listeners and display rates
    setupListeners();
    RatesService.get(updateDisplayedRates);

    /**
     * Returns true if any rates were loaded
     *
     * @return {boolean}
     */
    function loaded() {
      return vm.rates.length;
    }

    /**
     * Refreshes rates calling RatesService
     *
     * @return {undefined}
     */
    function refreshRates() {
      vm.refreshing = true;
      RatesService.refreshRates();
    }

    /**
     * Set up controller events.
     * Registers rates updated listener.
     *
     * @return {undefined}
     */
    function setupListeners() {
      // Listen to rates update
      var ratesUpdatedListener = $scope.$on('rates:updated', function() {

        // Disable manual refreshing during one minute
        vm.refreshing = null;
        $timeout(function() {
          vm.refreshing = false;
        }, 60 * 1000);

        RatesService.get(updateDisplayedRates);
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
    function updateDisplayedRates(rates) {
      if (typeof rates !== 'undefined' && rates !== null) {
        vm.rates = [
          {
            name: 'Oficial',
            sell: rates.oficial.sell,
            buy: rates.oficial.buy,
            variation: rates.oficial.variation,
            icon: 'money'
          },
          {
            name: 'Blue',
            sell: rates.blue.sell,
            buy: rates.blue.buy,
            variation: rates.blue.variation,
            icon: 'money'
          }
        ];

        vm.gapBuy = Math.abs(rates.blue.buy - rates.oficial.buy);
        vm.gapBuyPercentage = vm.gapBuy * 100 / rates.blue.buy;
        vm.gapSell = Math.abs(rates.blue.sell - rates.oficial.sell);
        vm.gapSellPercentage = vm.gapSell * 100 / rates.blue.sell;

        vm.lastUpdated = rates.date;
      }

      // Apply changes to view
      $timeout(function() {
        $scope.$apply();
      });
    }
  }
  PopupCtrl.$inject = ["$scope", "$timeout", "RatesService", "config"];

  angular.module('dbiPopup').controller('PopupCtrl', PopupCtrl);

})();

(function() {
  'use strict';

  /**
   * Auxiliar service for store rates data.
   *
   * @param {provider} Browser provider
   */
  function RatesService(provider) {

    /**
     * Returns latest stored rates.
     *
     * @param  {Function} cb Callback
     * @return {undefined}
     */
    function get(cb) {
      provider.get('rates', function(items) {
        cb(items.rates);
      });
    }

    /**
     * Force rates refresh.
     * Triggers rates:update event.
     *
     * @return {undefined}
     */
    function refreshRates() {
      provider.trigger('rates:doUpdate');
    }

    return {
      get: get,
      refreshRates: refreshRates
    };
  }
  RatesService.$inject = ["provider"];

  angular.module('dbiPopup').service('RatesService', RatesService);

})();

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
      controller: ["$scope", function($scope) {
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
      }]
    };
  }

  angular.module('dbiPopup').directive('dbiConverter', dbiConverter);

})();

(function() {
  'use strict';

  /**
   * Popup rates row directive
   *
   * @return {undefined}
   */
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
