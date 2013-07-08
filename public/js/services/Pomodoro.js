define(['app', 'angular'], function (app) {
  "use strict";

  var intervals = {
    'pomodoro': {
      seconds: 0,
      label: 'Focus'
    },
    'short': {
      seconds: 0,
      label: 'Break'
    },
    'long': {
      seconds: 0,
      label: 'Break'
    }
  };

  return app.factory('pomodoroService', ['$rootScope', 'settingsService', '$q', function (rootScope, settings) {
    var defaults;

    settings.get().then(function (prefs) {
      defaults = prefs.breaks;
    });

    rootScope.$on('settingsSaved', function (evt, settings) {
      defaults = settings.breaks;
    });

    function getInterval (name) {
      return function () {
        return settings.get().then(function (prefs) {
          var interval = intervals[name];
          interval.minutes = prefs.breaks[name];

          return angular.copy(interval);
        });
      };
    }

    return {
      pomodoro:   getInterval('pomodoro'),
      shortBreak: getInterval('short'),
      longBreak:  getInterval('long')
    };

  }]);
});

