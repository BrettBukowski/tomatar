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
        controller: function (location, historyService) {
          historyService.sync();
          location.url('/');
        },
        resolve: {
          location:       '$location',
          historyService: 'historyService'
        },
        // A view is required in order for the Controller to
        // get called.
        template: 'Hello!'
      })
      .otherwise({ redirectTo: '/' });
  }]);
});
