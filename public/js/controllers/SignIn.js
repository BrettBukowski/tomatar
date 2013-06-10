define(['app'], function (app) {
  return app.controller('SignInController', ['$scope', '$window', function (scope, win) {
    scope.signInWithStrategy = function (name) {
      win.location = '/auth/' + name;
    };
  }]);
});
