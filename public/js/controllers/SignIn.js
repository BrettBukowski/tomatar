define(['app'], function (app) {
  var services = [
    { name: 'Facebook' },
    { name: 'Github' },
    { name: 'Google' }
  ];

  return app.controller('SignInController', ['$scope', '$window', 'userService', function (scope, win, User) {
    scope.userHash = User.getUserHash();
    scope.services = services;

    scope.signInWithStrategy = function () {
      win.location = '/auth/' + this.service.name.toLowerCase();
    };

    scope.signedIn = function () {
      return User.signedIn();
    };

    scope.signOut = function () {
      return User.signOut();
    };

    scope.toggleTOS = function () {
      scope.tosExpanded = !scope.tosExpanded;
    };
  }]);
});
