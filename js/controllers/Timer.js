define(['app'], function (app) {
  "use strict";

  return app.controller('TimerController',
    ['$scope', '$rootScope', '$window', 'pomodoroService', 'faviconService',
    function (scope, rootScope, win, pomodoroService, Favicon) {
    var intervalId,
        favicon = new Favicon();

    function updateTitle (minutes, seconds, label) {
      win.document.title = minutes + ':' + ((seconds < 10) ? '0' : '') + seconds + ' - ' + label;
    }

    function updateFavicon (percentComplete) {
      if (percentComplete == 'pause') {
        favicon.pause();
      }
      else {
        favicon.refresh(percentComplete);
      }
    }

    function isRunning () {
      return !!intervalId;
    }

    function percentComplete (timeLeft, totalTime) {
      return Math.round(100 - (((timeLeft.minutes + (timeLeft.seconds / 60)) / totalTime) * 100));
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
      scope.progress = percentComplete(scope.timeLeft, scope.totalMinutes);

      scope.$apply();
    }

    scope.$watch('timeLeft', function (newVal) {
      updateTitle(newVal.minutes, newVal.seconds, newVal.label);
    }, true);

    scope.$watch('progress', updateFavicon);

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
      scope.timeLeft = { minutes: scope.totalMinutes, seconds: 0, label: scope.timeLeft.label };
      scope.progress = 0;
    };

    scope.pauseTimer = function () {
      if (isRunning()) {
        win.clearInterval(intervalId);
        intervalId = null;
        updateFavicon('pause');
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
