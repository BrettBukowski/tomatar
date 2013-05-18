define(['jquery', 'angular'], function ($, angular) {
  "use strict";

  return angular.module('tomatar', [])
    .run(['$rootScope', 'timeService', function (rootScope, TimeMaster) {
      rootScope.$on('timer', TimeMaster.timerFinished);

      // Initialize foundation. Options for ea. component aren't
      // granular, hence the workaround.
      $(document).foundation('reveal', {
        // Focus on the first input field when the dialog
        // displays.
        opened: function () {
          $(this).find('input,textarea')[0].focus();
        },
        // Broadcast an event for the specific dialog.
        close: function () {
          rootScope.$broadcast($(this).attr('id') + 'Closed');
        }
      });

    }]);
});
