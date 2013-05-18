define(['app', 'jquery'], function (app, $) {
  "use strict";

  return app.controller('SettingsController',
    ['$rootScope', '$scope', 'settingsService', 'notificationService', function (rootScope, scope, settingsService, notificationService) {
    var settings = settingsService.get();
    scope.breaks = settings.breaks;
    scope.alarms = settings.alarms;

    scope.notificationsAreAvailable = function () {
      return notificationService.available();
    };

    scope.toggleNotification = function () {
      if (scope.alarms.notification) {
        // Turning on notifications: check for permissions
        if (!notificationService.available()) {
          return scope.alarms.notification = false;
        }
        notificationService.requestPermission(function (granted) {
          scope.alarms.notification = granted;
        });
      }
    };

    scope.playSound = function () {
      rootScope.$broadcast('setSound', scope.alarms.sounds.current, 'playSoundToo');
    };

    scope.save = function () {
      settingsService.save({
        breaks: scope.breaks,
        alarms: scope.alarms
      });

      $('#settings .close-reveal-modal').click();
    };
  }]);
});
