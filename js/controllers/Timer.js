define(['app'], function (app) {
  "use strict";

  return app.controller('TimerController', ['$scope', '$window', 'pomodoroService', function (scope, win, pomodoroService) {
    var totalMinutes = pomodoroService.pomodoro().minutes;
    scope.timeLeft = pomodoroService.pomodoro();
    scope.progress = 0;

    var intervalId;

    function isRunning() {
      return !!intervalId;
    }

    scope.updateTimer = function () {
      if (scope.timeLeft.seconds == 0) {
        scope.timeLeft.minutes--;
        if (scope.timeLeft.minutes == 0) {
          scope.resetTimer();
          // notification
        }
        scope.timeLeft.seconds = 59;
      }
      else {
        scope.timeLeft.seconds--;
      }
      scope.progress = Math.round(100 - (((scope.timeLeft.minutes + (scope.timeLeft.seconds / 60)) / totalMinutes) * 100));

      scope.$apply();
    };

    scope.startTimer = function () {
      intervalId = win.setInterval(scope.updateTimer, 1000);
    };

    scope.resetTimer = function () {
      scope.pauseTimer();
      scope.timeLeft = pomodoroService.pomodoro();
    };

    scope.pauseTimer = function () {
      if (isRunning()) {
        win.clearInterval(intervalId);
        intervalId = null;
      }
    };

    scope.toggleTimer = function () {
      if (isRunning()) {
        scope.pauseTimer();
      }
      else {
        scope.startTimer();
      }
    };

    scope.$apply();
  }]);
});
