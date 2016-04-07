(function () {
  'use strict';

  var moment = require('moment'),
      RatesUpdater = require('./RatesUpdater.js'),
      provider = require('../provider.js');

  // Set up updater object
  var updater = new RatesUpdater({
    onUpdate: onRatesUpdated,
    onError: function(err) {
      console.log('Error: ' + err);
    }
  });

  // Initialize ui
  provider.setBadgeColor([50, 140, 50, 255]);
  updateIcon();

  // Listen to update rates requests
  provider.on('rates:doUpdate', function (data) {
    updater.checkRates({force: true});
  });

  /**
   * Fetch current rates from dolar-blue API.
   * Triggers event 'rates:updated'.
   *
   * @param  {Object} rates New rates data
   * @return {undefined}
   */
  function onRatesUpdated(data) {
    // Update icon with new value
    updateIcon(data.rates.oficial.sell, data.rates.date);

    // Save rates and notify
    data.rates.date = data.rates.date.toISOString();
    provider.store({'rates': data.rates}, function() {
      provider.trigger('rates:updated');
    });
  }

  /**
   * Update browser icon.
   * If no value is passed, shows temporary text.
   *
   * @param  {String} value
   * @param  {Date} date
   * @return {undefined}
   */
  function updateIcon(value, date) {
    var title;

    if (typeof value !== 'undefined') {
      title = 'Última actualización: ' + moment(date).format('DD/MM/YY HH:ss');
      value = parseFloat(value).toFixed(2);
    } else {
      title = 'Esperando datos...';
      value = '...';
    }


    provider.setIconInfo(title, value);
  }

}());
