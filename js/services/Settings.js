define(['app'], function (app) {
  "use strict";

  var storageKey = 'settings';
  var defaults = {
    'breaks': {
      'pomodoro': 25,
      'short':    5,
      'long':     15
    },
    'alarms': {
      'notification': false,
      'sounds':       {
        'available': ['Bell', 'Tink', 'Triumph', 'Blip', 'Kalimba'],
        'current':   null
      }
    }
  };

  return app.factory('settingsService', ['$rootScope', 'storageService', function (rootScope, storageService) {
    return {
      get: function () {
        return storageService.getJSON(storageKey) || defaults;
      },

      save: function (settings) {
        storageService.setJSON(storageKey, settings);

        rootScope.$broadcast('settingsSaved', settings);
      }
    };
  }]);
});
