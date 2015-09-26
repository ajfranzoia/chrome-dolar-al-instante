(function() {
  'use strict';

  /**
   * Angular-like Chrome factory
   */
  function Chrome() {
    return chrome;
  }

  angular.module('popup').factory('chrome', Chrome);
})();
