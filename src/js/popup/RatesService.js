(function() {
  'use strict';

  /**
   * Auxiliar service for store rates data.
   *
   * @param {Chrome} chrome Chrome angularized service
   */
  function RatesService(chrome, $http) {

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
     * Returns the API url with params
     *
     * @param  {String} type Currency type
     * @param  {Integer} offset number of records to skip
     * @return {String}
     */
    function getURL(type, offset) {
      return 'http://dolar-api.codaxis.com:3033/api/' + type + '?limit=20&offset=' + offset;
    }

    /**
     * Makes a request to the API
     *
     * @param  {String} type Currency type
     * @param  {Integer} offset number of records to skip
     * @return {Promise}
     */
    function getHistoric(type, offset) {
      return $http({
        method: 'GET',
        url: getURL(type, offset),
        transformResponse: [function (data) {
          return JSON.parse(data);
        }]
      }).then(function(response) {
        return response.data;
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
