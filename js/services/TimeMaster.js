define(['app', 'utils'], function (app, utils) {
  "use strict";

  // Labels for notification
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

  return app.factory('timeService', ['pomodoroService', function (pomodoroService) {
    function TimedSession () {
      this._completed = 0;
      this.isPomo = true;
      this.autoStart = true;
      this.timeInterval = pomodoroService.pomodoro();
      this.labels = labels.pomodoro;
    }

    TimedSession.prototype.complete = function () {
      var directions = this._whenComplete[(this.isPomo) ? 'pomo' : 'break'];

      this.autoStart = directions.autoStart;
      this.timeInterval = this[directions.timeInterval]();
      this.labels = labels[directions.labels];
      this.isPomo = !this.isPomo;
    };

    TimedSession.prototype._whenComplete = {
      // Labels are reversed, since they're displayed
      // when the interval ends and before a new
      // interval starts.
      'pomo': {
        'autoStart':    true,
        'timeInterval': '_finishedPomo',
        'labels':       'break'
      },
      'break': {
        'autoStart':    false,
        'timeInterval': '_finishedBreak',
        'labels':       'pomodoro'
      }
    };

    TimedSession.prototype._finishedPomo = function () {
      this._completed++;

      return (this._completed % 4 === 0)
        ? pomodoroService.longBreak()
        : pomodoroService.shortBreak();
    };

    TimedSession.prototype._finishedBreak = function () {
      return pomodoroService.pomodoro();
    };

    return TimedSession;
  }]);
});