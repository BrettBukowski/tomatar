define(['jquery', 'angular', 'angular-cookies', 'foundation'], function ($, angular) {
  "use strict";

  return angular.module('tomatar', ['ngCookies'])
    .run(['$rootScope', 'timeService', 'notificationService', 'settingsService', '$route', '$location',
      function (rootScope, TimeMaster, notificationService, settingsService, route, location) {
        var session = new TimeMaster();

        function timeIntervalComplete () {
          if (settingsService.get().alarms.notification) {
            notificationService.display(session.labels);
          }

          rootScope.$broadcast('timeInterval:complete', session.isPomo, session.timeInterval.minutes);
          session.complete();
          rootScope.$broadcast('timeInterval:new', angular.copy(session.timeInterval), session.autoStart);
        }

        rootScope.$on('timer', timeIntervalComplete);
        rootScope.$on('timerWarning', function () {
          if (session.isPomo && route.current.controller == 'HistoryController') {
            location.url('/');
          }
        });

      // Initialize foundation. Options for ea. component aren't
      // granular, hence the workaround.
      $(document).foundation('reveal', {
        // Focus on the first input field when the dialog
        // displays.
        opened: function () {
          $(this).find('input,textarea,a')[0].focus();
        },
        // Broadcast an event for the specific dialog.
        close: function () {
          rootScope.$broadcast($(this).attr('id') + 'Closed');
        }
      }).foundation('dropdown');

    }]);
});
