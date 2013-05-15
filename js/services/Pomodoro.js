define(['app'], function (app) {
  "use strict";

  return app.factory('pomodoroService', function () {
    var factory = {
      pomodoro: function() {
        return { minutes: 25, seconds: 0 };
      },
      break: function() {
        return { minutes: 5, seconds: 0 };
      },
      longBreak: function() {
        return { minutes: 15, seconds: 0 };
      }
    };

    return factory;
  });
});

