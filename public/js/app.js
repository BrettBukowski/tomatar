define(['jquery', 'angular', 'angular-cookies', 'angular-animate', 'angular-route', 'foundation', 'foundation-cookie', 'foundation-joyride', 'foundation-reveal', 'foundation-dropdown'], function ($, angular) {
  "use strict";

  return angular.module('tomatar', ['ngCookies', 'ngAnimate', 'ngRoute'])
    .run(['$rootScope', 'timeService', 'notificationService', 'settingsService', '$route', '$location',
      function (rootScope, TimeMaster, notificationService, settingsService, route, location) {
        var session = new TimeMaster();

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

        rootScope.$on('timer', timeIntervalComplete);
        rootScope.$on('timerWarning', function () {
          if (session.isPomo && route.current.controller == 'HistoryController') {
            location.url('/');
          }
        });

      // MONKEYPATCH ALERT: Foundation Joyride's loose usage of
      // Modernizr throws a JS error.
      Foundation.libs.joyride.is_phone = function () {
        return $(window).width() < 767;
      };

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
      }).foundation('joyride', 'start', {
        cookieMonster: true,
        cookieExpires: 600,
        cookieName: 'tour'
      }).foundation('dropdown');

      // Zurb Foundation... NEVER AGAIN.
    }]);
});
