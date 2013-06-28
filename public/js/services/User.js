define(['app'], function (app) {
  "use strict";

  return app.service('userService', ['$http', '$cookies', function (http, cookies) {
    this.loggedIn = function () {
      return !!cookies['connect.sid'];
    };

    this.logOut = function () {

    };
  }]);
});
