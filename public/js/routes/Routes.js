define(['app'], function (app) {
  "use strict";

  return app.config(['$routeProvider', function (routes) {
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
});
