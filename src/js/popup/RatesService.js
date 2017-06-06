(function() {
  'use strict';

  /**
   * Auxiliar service for store rates data.
   *
   * @param {Chrome} chrome Chrome angularized service
   */
  function RatesService(chrome) {

    /**
     * Returns latest stored rates.
     *
     * @param  {Function} cb Callback
     * @return {undefined}
     */
    function get(cb) {
      chrome.storage.local.get('rates', function(items) {
        cb(items.rates);
      });
    }

    /**
     * Returns the historic rates stored.
     *
     * @param  {Function} cb Callback
     * @return {undefined}
     */
    function getHistoric(cb) {
      chrome.storage.local.get('historic', function(result) {
        cb(result.historic);
      });
    }

    /**
     * Force rates refresh.
     * Triggers rates:update event.
     *
     * @return {undefined}
     */
    function refreshRates() {
      chrome.runtime.sendMessage({name: 'rates:update'}, function(response) {
      });
    }

    return {
      get: get,
      refreshRates: refreshRates,
      getHistoric: getHistoric
    };
  }

  angular.module('dbiPopup').service('RatesService', RatesService);

})();
