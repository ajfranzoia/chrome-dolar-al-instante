(function () {
  'use strict';

  var dolarblue = require('../../../lib/dolar-blue'),
      moment = require('moment'),
      updateInterval,
      lastRates,
      interval = 10 * 3600;

  chrome.browserAction.setBadgeBackgroundColor({color: [50, 140, 50, 255]});

  updateInterval = setInterval(fetchRates, interval);
  updateIcon();
  fetchRates();

  /**
   * Fetch current rates from dolar-blue API.
   * Triggers chrome message 'rates:updated'.
   *
   * @return {undefinde}
   */
  function fetchRates() {
    dolarblue(function (err, data) {
      if (err) { console.log("Error: " + err); return; }

      var rates = data.rates;

      // Check variation against last rates if found
      if (lastRates) {
        rates.blue.variation = rates.blue.sell > lastRates.blue.sell ? 1 : (rates.blue.sell === lastRates.blue.sell ? 0 : -1);
        rates.oficial.variation = rates.oficial.sell > lastRates.oficial.sell ? 1 : (rates.oficial.sell === lastRates.oficial.sell ? 0 : -1);
      } else {
        rates.blue.variation = null;
        rates.oficial.variation = null;
      }
      lastRates = rates;

      // Update icon with new value
      updateIcon(rates.blue.sell, rates.date);

      // Save rates and notify
      rates.date = rates.date.toISOString();
      chrome.storage.local.set({'rates': rates}, function() {
        chrome.runtime.sendMessage({event: 'rates:updated'}, function() {});
      });
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
      value = String(value);
    } else {
      title = 'Esperando datos...';
      value = '...';
    }

    chrome.browserAction.setTitle({title: title});
    chrome.browserAction.setBadgeText({text: value});
  }

})();
