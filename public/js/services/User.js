define(['app'], function (app) {
  "use strict";

  return app.service('userService', ['$http', '$cookies', function (http, cookies) {
    this.signedIn = function () {
      return cookies.signin == 'true';
    };

    this.signOut = function () {
      http.post('/signout')
    };
  }]);
});
