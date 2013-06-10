define(['app', 'utils'], function (app, utils) {
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
    },
    'ui': {
      'hours': 12
    }
  };

  return app.factory('settingsService', ['$rootScope', 'storageService', function (rootScope, storageService) {
    var settings;

    return {
      get: function () {
        if (settings) return settings;

        var retrieved = storageService.getJSON(storageKey);
        settings = (retrieved)
          ? utils.mergeDefaults(retrieved, defaults)
          : defaults;

        return settings;
      },

      save: function (modifiedSettings) {
        settings = modifiedSettings;
        storageService.setJSON(storageKey, modifiedSettings);

        rootScope.$broadcast('settingsSaved', modifiedSettings);
      }
    };
  }]);
});
