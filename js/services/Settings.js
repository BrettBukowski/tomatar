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
    },
    'ui': {
      'hours': 12
    }
  };

  function isArray (obj) {
    return Array.isArray
      ? Array.isArray(obj)
      : Object.prototype.toString.call(obj).indexOf('Array') > -1;
  }

  // Allows for adding new settings keys in future versions
  // that will get auto-merged in on the client.
  function mergeDefaults (receiver, provider) {
    for (var i in provider) {
      if (!provider.hasOwnProperty(i)) continue;
      if (provider[i] && typeof provider[i] === 'object' && !isArray(provider[i])) {
        receiver[i] = mergeDefaults(receiver[i] || {}, provider[i]);
      }
      else if (!(i in receiver)) {
        receiver[i] = provider[i];
      }
    }

    return receiver;
  }

  return app.factory('settingsService', ['$rootScope', 'storageService', function (rootScope, storageService) {
    var settings;

    return {
      get: function () {
        if (settings) return settings;

        var retrieved = storageService.getJSON(storageKey);
        settings = (retrieved)
          ? mergeDefaults(retrieved, defaults)
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
