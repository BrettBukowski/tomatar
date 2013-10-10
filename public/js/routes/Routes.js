define(['app', 'controllers/Today', 'controllers/History', 'services/History'], function (app) {
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
      .when('/signedin', {
        controller: ['$location', 'historyService', function (location, historyService) {
          historyService.sync();
          location.url('/');
        }],
        // A view is required in order for the Controller to
        // get called.
        template: '<span class="text-center">Hello!</span>'
      })
      .otherwise({ redirectTo: '/' });
  }]);
});
