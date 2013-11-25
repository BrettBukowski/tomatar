define([
  'jquery',
  'angular',
  'angular-cookies',
  'angular-animate',
  'angular-route',
  'foundation',
  'jquery-cookie',
  'foundation-joyride',
  'foundation-reveal',
  'foundation-dropdown'
], function ($, angular) {
  "use strict";

  return angular.module('tomatar', ['ngCookies', 'ngAnimate', 'ngRoute']).run(['$rootScope', function (rootScope) {
    $(document).foundation({
      reveal: {
        // Focus on the first input field when the dialog
        // displays.
        opened: function () {
          $(this).find('input,textarea,a')[0].focus();
        },
        // Broadcast an event for the specific dialog.
        close: function () {
          rootScope.$broadcast($(this).attr('id') + 'Closed');
        }
      },
      joyride: {
        cookie_monster: true,
        cookie_expires: 600,
        cookie_name: 'tour'
      }
    }).foundation('joyride', 'start');
  }]);
});
