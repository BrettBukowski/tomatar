define(['app', 'utils', 'angular'], function (app, utils, angular) {
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

  return app.factory('settingsService', ['$rootScope', 'storageService', 'userService', '$q',
    function (rootScope, storageService, userService, Q) {
    var settings,
        fetchedRemoteSettings = false;

    function saveLocally (toSave) {
      storageService.setJSON(storageKey, toSave);
    }

    function saveToServer (toSave) {
      if (userService.signedIn()) {
        var save = angular.copy(toSave);
        delete save.alarms.sounds.available;
        userService.savePrefs(save);
      }
    }

    function getLocallySaved () {
      var retrieved = storageService.getJSON(storageKey);
      if (retrieved) return utils.mergeDefaults(retrieved, defaults);
      if (!userService.signedIn()) return defaults;
    }

    return {
      get: function () {
        var deferred = Q.defer();

        if (!settings) {
          var local = getLocallySaved();
          if (local) {
            settings = local;
          }
          else {
            var self = this;

            var noRemotePreferences = function () {
              settings = defaults;
              deferred.resolve(settings);
              saveLocally(settings);
            };
            userService.getPrefs().then(function (result) {
              if (!result) return noRemotePreferences();

              settings = utils.mergeDefaults(result, defaults);
              deferred.resolve(settings);
              saveLocally(settings);
            }, noRemotePreferences);
          }
        }

        if (settings) deferred.resolve(settings);

        return deferred.promise;
      },

      save: function (modifiedSettings) {
        settings = modifiedSettings;
        saveLocally(modifiedSettings);
        saveToServer(modifiedSettings);
        rootScope.$broadcast('settingsSaved', modifiedSettings);
      },

      destroy: function () {
        storageService.remove(storageKey);
      }
    };
  }]);
});
