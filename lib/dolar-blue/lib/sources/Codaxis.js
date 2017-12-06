var http = require('http');
var _ = require('lodash');

exports.getData = function (cb) {

  var options = {
    scheme: 'http',
    name: 'Codaxis',
    host: 'dolar-api.codaxis.com',
    port: 3033,
    path: '/api/current'
  };

  var req = http.request(options, function (res) {
    var str = '';

    res.on('data', function (chunk) {
      str += chunk;
    });

    res.on('end', function () {

      var ret = {};
      ret.date = new Date();
      ret.source = {
        name: options.name,
        uri: 'http://' + options.host + options.port + options.path
      };

      // Parse response from Bluelytics
      try {
        ret.data = JSON.parse(str);
        if (!ret.data) {
          throw 'Empty data';
        }
      } catch (err) {
        return cb('Bad JSON from ' + options.host + options.path + ':' + err + '\n' + str);
      }

      ret.rates = _.extend(ret.data, {date: new Date(ret.data.oficial.date)});
      ret.rates.source = options.name;

      if ( ! isNaN(ret.rates.blue.sell) && ! isNaN(ret.rates.blue.buy) ) {
        cb(null, ret);
      } else {
        cb('Unexpected response from ' + options.host + options.path);
      }
    });
  });

  req.end();

  req.on('error', function (e) {
    cb(e);
  });

};
