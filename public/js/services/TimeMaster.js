define(['app', 'angular', 'services/Pomodoro'], function (app, angular) {
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

  return app.factory('timeService', ['pomodoroService', '$q', function (pomodoroService, Q) {
    function TimedSession () {
      this._completed = 0;
      this.started = false;
      this.isPomo = true;
      this.autoStart = true;
      this._setTimeInterval('pomodoro');
      this.labels = labels.pomodoro;
    }

    TimedSession.prototype.start = function () {
      this.started = true;
    };

    TimedSession.prototype.complete = function () {
      var directions = this._whenComplete[(this.isPomo) ? 'pomo' : 'break'];

      this.started = false;
      this.autoStart = directions.autoStart;
      this.labels = labels[directions.labels];
      this.isPomo = !this.isPomo;
      return this._setTimeInterval(this[directions.timeInterval]());
    };

    TimedSession.prototype._setTimeInterval = function (intervalName) {
      this.currentInterval = intervalName;
      return pomodoroService[intervalName]().then(angular.bind(this, function (interval) {
        this.timeInterval = interval;

        return this;
      }));
    };

    TimedSession.prototype.refresh = function () {
      if (this.started) {
        var defer = Q.defer();
        defer.reject('Cannot refresh already-started session');
        return defer.promise;
      }
      return this._setTimeInterval(this.currentInterval);
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