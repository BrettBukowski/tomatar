define(['jquery', 'app', 'services/User'], function ($, app) {
  var services = [
    { name: 'Facebook' },
    { name: 'Github' },
    { name: 'Google' }
  ];

  return app.controller('SignInController', ['$scope', '$window', 'userService', 'historyService', 'settingsService',
    function (scope, win, User, historyService, settingsService) {
    scope.services = services;
    scope.userAvatar = User.getUserHash() || '';

    scope.signInWithStrategy = function () {
      win.location = '/auth/' + this.service.name.toLowerCase();
    };

    scope.signedIn = function () {
      return User.signedIn();
    };

    scope.signOut = function () {
      return User.signOut().then(function () {
        historyService.destroy();
        settingsService.destroy();
      });
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
