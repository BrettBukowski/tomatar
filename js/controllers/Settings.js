define(['app'], function (app) {
  "use strict";

  return app.controller('SettingsController', ['$scope', 'settingsService', 'notificationService', function (scope, settingsService, notificationService) {
    scope.breaks = settingsService.breaks;
    scope.alarms = settingsService.alarms;

    scope.toggleNotification = function () {
      if (!scope.alarms.notification.current) {
        notificationService.requestPermission(function (granted) {
          scope.alarms.notification.current = granted;
        });
      }
    };
  }]);
});
