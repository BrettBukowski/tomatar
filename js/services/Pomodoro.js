define(['app'], function (app) {
  "use strict";

  return app.factory('pomodoroService', ['settingsService', function (settings) {
    var defaults = settings.get().breaks;

    var factory = {
      pomodoro: function() {
        return { minutes: defaults.pomodoro, seconds: 0 };
      },
      shortBreak: function() {
        return { minutes: defaults['short'], seconds: 0 };
      },
      longBreak: function() {
        return { minutes: defaults['long'], seconds: 0 };
      }
    };

    return factory;
  }]);
});

