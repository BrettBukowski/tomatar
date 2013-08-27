define(['app', 'utils', 'services/Pomodoro'], function (app, utils) {
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
      this._setTimeInterval('pomodoro');
      this.labels = labels.pomodoro;
    }

    TimedSession.prototype.complete = function () {
      var directions = this._whenComplete[(this.isPomo) ? 'pomo' : 'break'];

      this.autoStart = directions.autoStart;
      this.labels = labels[directions.labels];
      this.isPomo = !this.isPomo;
      return this._setTimeInterval(this[directions.timeInterval]());
    };

    TimedSession.prototype._setTimeInterval = function (intervalName) {
      var self = this;

      return pomodoroService[intervalName]().then(function (interval) {
        self.timeInterval = interval;

        return self;
      });
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

      return (this._completed % 4 === 0) ? 'longBreak' : 'shortBreak';
    };

    TimedSession.prototype._finishedBreak = function () {
      return 'pomodoro';
    };

    return TimedSession;
  }]);
});