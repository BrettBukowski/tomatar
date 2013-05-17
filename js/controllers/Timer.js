define(['app'], function (app) {
  "use strict";

  return app.controller('TimerController', ['$scope', '$rootScope', '$window', 'pomodoroService', function (scope, rootScope, win, pomodoroService) {
    var intervalId;

    function isRunning() {
      return !!intervalId;
    }

    function updateTimer () {
      if (scope.timeLeft.seconds == 0) {
        scope.timeLeft.minutes--;
        if (scope.timeLeft.minutes == -1) {
          scope.timeLeft.minutes = 0;
          scope.resetTimer();
          rootScope.$emit('timer');
        }
        else {
          scope.timeLeft.seconds = 59;
        }
      }
      else {
        scope.timeLeft.seconds--;
      }
      scope.progress = Math.round(100 - (((scope.timeLeft.minutes + (scope.timeLeft.seconds / 60)) / scope.totalMinutes) * 100));

      scope.$apply();
    }

    scope.initialize = function (time) {
      scope.totalMinutes = time.minutes;
      scope.timeLeft = time;
      scope.progress = 0;
    };

    scope.startTimer = function () {
      intervalId = win.setInterval(updateTimer, 1000);
    };

    scope.resetTimer = function () {
      scope.pauseTimer();
      scope.timeLeft = { minutes: scope.totalMinutes, seconds: 0 };
      scope.progress = 0;
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

    rootScope.$on('timeInterval:new', function (e, time, autoStart) {
      scope.resetTimer();
      scope.initialize(time);
      if (autoStart) {
        scope.startTimer();
      }
    });

    scope.initialize(pomodoroService.pomodoro());
  }]);
});
