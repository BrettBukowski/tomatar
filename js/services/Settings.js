define(['app'], function (app) {
  "use strict";

  return app.factory('settingsService', function () {
    var factory = {
      'breaks': {
        'pomodoro': {
          'current': 25
        },
        'short': {
          'current': 5
        },
        'long': {
          'current': 15
        }
      },
      'alarms': {
        'notification': {
          'current': false
        },
        'sounds': {
          'current': true
        }
      }
    };

    return factory;
  });
});
