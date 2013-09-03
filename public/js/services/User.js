define(['app'], function (app) {
  "use strict";

  return app.service('userService', ['$http', '$cookies', '$q', function (http, cookies, Q) {
    var signedIn = !!cookies.signin && /^[a-fA-F0-9]{10,}$/.test(cookies.signin);

    function guardUser (userFunc) {
      return function () {
        if (!signedIn) {
          var deferred = Q.defer();
          deferred.reject('User is not signed in');
          return deferred.promise;
        }
        return userFunc.apply(null, arguments);
      };
    }

    function defaultResponder (response) {
      return response.data.result;
    }

    this.getUserHash = function () {
      return cookies.signin;
    };

    this.signedIn = function () {
      return signedIn;
    };

    this.signOut = function () {
      return http.post('/signout').success(function () {
        signedIn = false;
      });
    };

    this.savePrefs = guardUser(function (prefs) {
      return http.post('/user/prefs', { prefs: prefs });
    });

    this.getPrefs = guardUser(function () {
      return http.get('/user/prefs').then(defaultResponder);
    });

    this.savePomodoro = guardUser(function (pomodoro) {
      return http.post('/user/pomodoro', pomodoro).then(defaultResponder);
    });

    this.getPomodoro = guardUser(function () {
      return http.get('/user/pomodoro').then(defaultResponder);
    });

    this.syncPomodori = guardUser(function (pomodori) {
      return http.post('/user/pomodoro/sync', { pomodori: pomodori }).then(defaultResponder);
    });

    this.destroy = guardUser(function () {
      return http['delete']('/user').then(function (response) {
        cookies.signin = undefined;
        return defaultResponder(response);
      });
    });
  }]);
});
