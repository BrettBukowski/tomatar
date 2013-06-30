define(['app'], function (app) {
  "use strict";

  return app.service('userService', ['$http', '$cookies', function (http, cookies) {
    var signedIn = cookies.signin == 'true';

    this.signedIn = function () {
      return signedIn;
    };

    this.signOut = function () {
      http.post('/signout').success(function () {
        signedIn = false;
      });
    };
  }]);
});
