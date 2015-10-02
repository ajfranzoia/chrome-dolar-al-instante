var moment = require('moment');
var dolarblue = require('../../../lib/dolar-blue');

/**
 * Rates updater utility
 *
 * @param {Object} config Configuration options
 */
var RatesUpdater = function(config) {

  var lastRates, checkInterval;
  var defaults = {
    checkInterval: 10 * 3600,
    stabilityThreshold: 10 * 3600 * 6,
    onUpdate: function() {},
    onError: function() {}
  };

  // Init config values
  config = config || {};
  for (var key in defaults) {
    if (defaults.hasOwnProperty(key) && !config.hasOwnProperty(key)) {
      config[key] = defaults[key];
    }
  }

  // Start checking
  checkRates();

  /**
   * Fetch current rates from dolar-blue API.
   * Triggers chrome message 'rates:updated'.
   *
   * @return {undefined}
   */
  function checkRates() {
    dolarblue(function (err, data) {
      if (err) { config.onError(err); return; }

      // Pick only desired fields
      var data = {
        rates: data.rates, // rates info
        date: data.date // current time
      };
      var rates = data.rates;

      // Check variation against last rates if found
      if (lastRates) {
        rates.blue.variation = rates.blue.sell > lastRates.blue.sell ? 1 : (rates.blue.sell === lastRates.blue.sell ? 0 : -1);
        rates.oficial.variation = rates.oficial.sell > lastRates.oficial.sell ? 1 : (rates.oficial.sell === lastRates.oficial.sell ? 0 : -1);
      } else {
        rates.blue.variation = rates.oficial.variation = null;
      }

      lastRates = rates;
      data.rates = rates;

      // Call listener
      config.onUpdate(data);

      // Schedule next check
      setTimeout(checkRates, config.checkInterval);
    });
  }
};

module.exports = RatesUpdater;
