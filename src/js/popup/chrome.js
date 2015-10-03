(function() {
  'use strict';

  /**
   * Angular-like Chrome factory
   */
  function Chrome() {
    return chrome;
  }

  angular.module('dbiPopup').factory('chrome', Chrome);
})();
