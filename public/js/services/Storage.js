define(['app', 'angular'], function (app, angular) {
  "use strict";

  return app.service('storageService', ['$window', function (win) {
      this.available = 'localStorage' in win;

      this.get = function (key) {
        return win.localStorage.getItem(key);
      };

      this.set = function (key, value) {
        return win.localStorage.setItem(key, value);
      };

      this.setJSON = function (key, value) {
        return this.set(key, angular.toJson(value));
      };

      this.getJSON = function (key) {
        return angular.fromJson(this.get(key));
      };
  }]);
});
