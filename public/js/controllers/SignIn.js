define(['jquery', 'app', 'services/User'], function ($, app) {
  var services = [
    { name: 'Facebook' },
    { name: 'Github' },
    { name: 'Google' }
  ];

  return app.controller('SignInController', ['$scope', '$window', 'userService', function (scope, win, User) {
    scope.services = services;
    scope.userAvatar = User.getUserHash() || '';

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

    $('#signIn')
      .on('opened', function () {
        $(this).find('button')[0].focus();
      })
      .on('closed', function () {
        $('[data-dropdown="signIn"]').focus();
      });
  }]);
});
