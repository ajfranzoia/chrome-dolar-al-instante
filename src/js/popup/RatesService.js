(function() {
  'use strict';

  /**
   * Auxiliar service for store rates data.
   *
   * @param {Chrome} chrome Chrome angularized module
   */
  function RatesService(chrome) {

    /**
     * Returns latest stored rates.
     *
     * @param  {Function} cb Callback
     * @return {undefined}
     */
    this.get = function (cb) {
      chrome.storage.local.get('rates', function(items) {
        cb(items.rates);
      });
    };

  }

  angular.module('popup').service('RatesService', RatesService);

})();
