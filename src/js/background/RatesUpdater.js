(function () {
  'use strict';

  var moment = require('moment');
  var dolarblue = require('../../../lib/dolar-blue');

  /**
   * Rates updater utility
   *
   * @param {Object} config Configuration options
   */
  var RatesUpdater = function(config) {

    var lastRates,
        checkInterval,
        nextCheck;

    var defaults = {
      checkInterval: 10 * 60, // 600 seconds (10 minutes)
      onUpdate: function() {},
      onError: function() {}
    };

    // Export public methods
    this.checkRates = checkRates;

    // Init config values
    config = config || {};
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key) && !config.hasOwnProperty(key)) {
        config[key] = defaults[key];
      }
    }

    // Start checking
    checkRates();

    console.log('RatesUpdates initialized with config:', config);

    /**
     * Fetch current rates from dolar-blue API.
     * Triggers chrome message 'rates:updated'.
     *
     * @return {undefined}
     */
    function checkRates(options) {
      options = options || {};

      // Do not check if there is any restriction
      if (!shouldCheck() && !options.force) {
        return;
      }

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
        nextCheck = setTimeout(checkRates, config.checkInterval * 1000);
      });
    }

    /**
     * Decides if new rates should be fetched.
     * Will not fetch rates during weekends or before 8AM/after 6PM during weekdays.
     *
     * @return {boolean}
     */
    function shouldCheck() {
      var now = moment();

      if (!lastRates) {
        return true;
      }

      // Disable checks before 8AM and 6PM during weekdays
      if (now.hour() < 8 || now.hour() > 18) {
        return false;
      }

      // Disable checks during weekend
      if (now.day() === 0 || now.day() === 6) {
        return false;
      }

      return true;
    }
  };

  module.exports = RatesUpdater;

}());
