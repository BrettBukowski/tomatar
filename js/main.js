var app = angular.module('tomatar', []);

app.config(['$routeProvider', function (routes) {
    routes
      .when('/', {
        controller: 'TodayController',
        templateUrl: '/partials/today.html'
      })
      .when('/history', {
        controller: 'HistoryController',
        templateUrl: '/partials/history.html'
      })
      .otherwise({ redirectTo: '/' });
}]);

app.controller('TodayController', ['$scope', function (scope) {

}]);

app.controller('HistoryController', ['$scope', function (scope) {

}]);

app.controller('SettingsController', ['$scope', 'settingsService', function (scope, settingsService) {
  scope.breaks = settingsService.breaks;
  scope.alarms = settingsService.alarms;
}]);

app.controller('TimerController', ['$scope', '$window', 'pomodoroService', function (scope, win, pomodoroService) {
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
}]);

app.filter('padSeconds', function () {
  return function (input) {
    return (input < 10) ? '0' + input : input;
  };
});

app.factory('pomodoroService', function () {
  var factory = {
    pomodoro: function() {
      return { minutes: 25, seconds: 0 };
    },
    break: function() {
      return { minutes: 5, seconds: 0 };
    },
    longBreak: function() {
      return { minutes: 15, seconds: 0 };
    }
  };

  return factory;
});

app.factory('settingsService', function () {
  var factory = {
    'breaks': {
      'pomodoro': {
        'default': 25,
        'current': 25
      },
      'short': {
        'default': 5,
        'current': 5
      },
      'long': {
        'default': 15,
        'current': 15
      }
    },
    'alarms': {
      'notification': {
        'default': true,
        'current': true
      },
      'sounds': {
        'default': true,
        'current': true
      }
    }
  };

  return factory;
});
