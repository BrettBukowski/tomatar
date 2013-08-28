define(['jquery', 'app', 'services/User'], function ($, app) {
  var services = [
    { name: 'Facebook' },
    { name: 'Github' },
    { name: 'Google' }
  ],
  avatarUrl = '//www.gravatar.com/avatar/%s?s=26&d=identicon';

  return app.controller('SignInController', ['$scope', '$window', 'userService', function (scope, win, User) {
    scope.services = services;

    var userHash = User.getUserHash();
    scope.userAvatar = (userHash) ? avatarUrl.replace('%s', userHash) : '';

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
