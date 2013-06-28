define(['app'], function (app) {
  return app.controller('SignInController', ['$scope', '$window', 'userService', function (scope, win, User) {
    scope.signInWithStrategy = function (name) {
      win.location = '/auth/' + name;
    };

    scope.signedIn = function () {
      return User.loggedIn();
    };
  }]);
});
