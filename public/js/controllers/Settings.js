define(['app', 'jquery', 'services/Settings', 'services/Notification', 'services/User', 'services/History', 'services/DataExport'], function (app, $) {
  "use strict";

  return app.controller('SettingsController',
    ['$rootScope', '$scope', '$window', 'settingsService', 'notificationService', 'userService', 'historyService', 'dataExportService',
    function (rootScope, scope, win, settingsService, notificationService, userService, historyService, dataExportService) {
    var settingsKeys = [];

    function populateScopeFromSettings (settings) {
      for (var i in settings) {
        if (settings.hasOwnProperty(i)) {
          scope[i] = settings[i];
          settingsKeys.push(i);
        }
      }
      !scope.$$phase && scope.$apply();
    }

    function populateSettingsFromScope (keys) {
      var settings = {};
      for (var i = 0, len = keys.length, key; i < len; i++) {
        key = keys[i];
        settings[key] = scope[key];
      }

      return settings;
    }

    // asType: 'json' or 'csv'
    function downloadData (asType) {
      historyService.getHistory().then(function (entries) {
        var exporter = dataExportService.export(asType);

        entries.forEach(function (month) {
          month.days.forEach(function (day) {
            exporter.addEntries(day.finished);
          });
        });

        exporter.save();
      });
    }

    function reshowSettingsDialog ($event) {
      $event && $event.stopPropagation();
      $('#settings').foundation('reveal', 'open');
    }

    function deleteAccount () {
      userService.destroy().then(function () {
        historyService.destroy();
        settingsService.destroy();
        win.location.reload();
      });
    }

    if (scope.signedIn = userService.signedIn()) {
      scope.download = downloadData;
      scope.deleteAccount = deleteAccount;
      scope.reshowSettingsDialog = reshowSettingsDialog;
    }

    scope.show = function (e) {
      e.preventDefault();
      $('#settings').foundation('reveal', 'open');
    };

    scope.notificationsAreAvailable = function () {
      return notificationService.available();
    };

    scope.toggleNotification = function () {
      if (scope.alarms.notification) {
        // Turning on notifications: check for permissions
        if (!notificationService.available()) {
          return (scope.alarms.notification = false);
        }
        notificationService.requestPermission(function (granted) {
          scope.alarms.notification = granted;
        });
      }
    };

    scope.playSound = function () {
      rootScope.$broadcast('setSound', scope.alarms.sounds.current, 'playSoundToo');
    };

    scope.save = function (e) {
      e.preventDefault();
      settingsService.save(populateSettingsFromScope(settingsKeys));

      $('#settings').foundation('reveal', 'close');
    };

    settingsService.get().then(populateScopeFromSettings);
  }]);
});
