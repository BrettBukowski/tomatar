define([
  'app',
  'controllers/SignIn',
  'controllers/Settings',
  'controllers/Sound',
  'controllers/Timer',
  'services/TimeMaster',
  'services/Notification',
  'services/Settings',
  'filters/Filter',
  'routes/Routes',
  ], function (app) {
  "use strict";

  return function () {
    app.run(['$rootScope', 'timeService', 'notificationService', 'settingsService', '$route', '$location',
    function (rootScope, TimeMaster, notificationService, settingsService, route, location) {
      var session = new TimeMaster();

      function timeIntervalStart () {
        session.start();
      }

      function timeIntervalComplete () {
        settingsService.get().then(function (settings) {
          if (settings.alarms.notification) {
            notificationService.display(session.labels);
          }
          rootScope.$broadcast('timeInterval:complete', session.isPomo, session.timeInterval.minutes);
          session.complete().then(function () {
            rootScope.$broadcast('timeInterval:new', angular.copy(session.timeInterval), session.autoStart);
          });
        });
      }

      function timeIntervalRefresh () {
        session.refresh().then(function () {
          rootScope.$broadcast('timeInterval:new', angular.copy(session.timeInterval));
        });
      }

      function focusToday () {
        if (session.isPomo && route.current.controller == 'HistoryController') {
          location.url('/');
        }
      }

      rootScope.$on('timer', timeIntervalComplete);
      rootScope.$on('timerWarning', focusToday);
      rootScope.$on('timerStart', timeIntervalStart);
      rootScope.$on('settingsSaved', timeIntervalRefresh);
    }]);
  };
});
