(function () {
  'use strict';

  var moment = require('moment');
  var RatesUpdater = require('./RatesUpdater.js');

  // Set up updater object
  var updater = new RatesUpdater({
    onUpdate: onRatesUpdated,
    onError: function(err) {
      console.log('Error: ' + err);
    }
  });

  // Initialize ui
  chrome.browserAction.setBadgeBackgroundColor({color: [50, 140, 50, 255]});
  updateIcon();

  // Listen to update rates requests
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name === 'rates:update') {
      updater.checkRates({force: true});
    }
  });


  /**
   * Fetch current rates from dolar-blue API.
   * Triggers chrome message 'rates:updated'.
   *
   * @param  {Object} rates New rates data
   * @return {undefined}
   */
  function onRatesUpdated(data) {
    // Update icon with new value
    updateIcon(data.rates.oficial.sell, data.rates.date);

    // Save rates and notify
    data.rates.date = data.rates.date.toISOString();
    chrome.storage.local.set({'rates': data.rates}, function() {
      chrome.runtime.sendMessage({event: 'rates:updated'}, function() {});
    });

    //saves historic
    saveHistoric(data);
  }

  /**
   * Get stored historic data
   * @param  {Function}
   */
  function getHistoric(cb) {
    //Get accepts as a param an object which defines a default value
    chrome.storage.local.get({'historic': []}, function(result) {
      return cb(null, result.historic);
    });
  }

  /**
   * Returns whether or not data has changed and thus should be saved
   * @param  {Array} Historic data
   * @param  {Object} Current data
   */
  function shouldSaveHistoric(historic, data) {
    return  historic.length === 0 ||
            historic[historic.length - 1].sell != data.rates.oficial.sell ||
            historic[historic.length - 1].buy != data.rates.oficial.buy;
  }

  /**
   * Saves, if the condition is met, the new data into the historic
   * @param  {Object} Current data
   */
  function saveHistoric(data) {
    getHistoric(function(err, historic) {
      if(shouldSaveHistoric(historic, data)) {
        historic.push({
          date: moment(data.rates.date).format('DD/MM'),
          sell: data.rates.oficial.sell,
          buy: data.rates.oficial.buy
        });
        chrome.storage.local.set({'historic': historic}, function() {});
      }
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

    chrome.browserAction.setTitle({title: title});
    chrome.browserAction.setBadgeText({text: value});
  }

}());
