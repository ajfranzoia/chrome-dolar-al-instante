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

  angular.module('dbiPopup').service('RatesService', RatesService);

})();
