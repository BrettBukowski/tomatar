define(['app'], function (app) {
  "use strict";

  var labels = {
    'pomodoro': {
      'title': 'Pomodoro finished!',
      'body':  'Time for a break.'
    },
    'break': {
      'title': "Break time's over!",
      'body':  'Back to work.'
    }
  };

  function clone (obj) {
    var result = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        result[i] = obj[i];
      }
    }

    return result;
  }

  return app.factory('timeService',
    ['$rootScope', 'pomodoroService', 'notificationService', 'settingsService',
    function (rootScope, pomodoroService, notificationService, settingsService) {

    function TimedSession () {
      this.completed = 0;
      this.isPomo = true;
      this.autoStart = true;
      this.timeInterval = pomodoroService.pomodoro();
    }
    TimedSession.prototype.complete = function () {
      if (this.isPomo) {
        this.autoStart = true;
        this.timeInterval = this.finishedPomo();
      }
      else {
        this.autoStart = false;
        this.timeInterval = this.finishedBreak();
      }

      this.isPomo = !this.isPomo;
    };
    TimedSession.prototype.finishedPomo = function () {
      this.completed++;

      return (this.completed % 4 === 0)
        ? pomodoroService.longBreak()
        : pomodoroService.shortBreak();
    };
    TimedSession.prototype.finishedBreak = function () {
      return pomodoroService.pomodoro();
    };

    var session = new TimedSession();

    return {
      timerFinished: function () {
        var copy = (session.isPomo) ? labels.pomodoro : labels['break'];

        if (settingsService.get().alarms.notification) {
          notificationService.display(copy.title, copy.body);
        }

        rootScope.$broadcast('timeInterval:complete', session.isPomo, session.timeInterval.minutes);

        session.complete();

        rootScope.$broadcast('timeInterval:new', clone(session.timeInterval), session.autoStart);
      }
    };
  }]);
});