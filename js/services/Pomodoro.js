define(['app'], function (app) {
  "use strict";

  return app.factory('pomodoroService', ['$rootScope', 'settingsService', function (rootScope, settings) {
    var defaults = settings.get().breaks;

    rootScope.$on('settingsSaved', function (evt, settings) {
      defaults = settings.breaks;
    });

    var factory = {
      pomodoro: function() {
        return { minutes: defaults.pomodoro, seconds: 0, label: 'Focus' };
      },
      shortBreak: function() {
        return { minutes: defaults['short'], seconds: 0, label: 'Break' };
      },
      longBreak: function() {
        return { minutes: defaults['long'], seconds: 0, label: 'Break' };
      }
    };

    return factory;
  }]);
});

