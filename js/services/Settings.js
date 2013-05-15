define(['app'], function (app) {
  "use strict";

  var storageKey = 'settings';
  var defaults = {
    'breaks': {
      'pomodoro': 25,
      'short': 5,
      'long': 15
    },
    'alarms': {
      'notification': false,
      'sounds': true
    }
  };

  return app.factory('settingsService', ['storageService', function (storageService) {
    return {
      get: function () {
        return storageService.getJSON(storageKey) || defaults;
      },

      save: function (settings) {
        storageService.setJSON(storageKey, settings);
      }
    };
  }]);
});
