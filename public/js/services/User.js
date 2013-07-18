define(['app'], function (app) {
  "use strict";

  return app.service('userService', ['$http', '$cookies', '$q', function (http, cookies, Q) {
    var signedIn = cookies.signin == 'true';

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
      return http.get('/user/prefs').then(function (response) {
        return response.data.result;
      });
    });

    this.savePomodoro = guardUser(function (pomodoro) {
      return http.post('/user/pomodoro', pomodoro);
    });

    this.getPomodoro = guardUser(function () {
      return http.get('/user/pomodoro').then(function (response) {
        return response.data.result;
      });
    });

    this.syncPomodori = guardUser(function (pomodori) {
      return http.post('/user/pomodoro/sync', { pomodori: pomodori });
    });
  }]);
});
