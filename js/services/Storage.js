define(function () {
  "use strict";

  return {
    name: 'storageService',
    factory: ['$window', function (win) {
      var factory = {
        available: 'localStorage' in win,

        get: function (key) {
          return win.localStorage.get(key);
        },

        set: function (key, value) {
          return win.localStorage.set(key, value);
        }
      };

      return factory;
    }]
  };
});
// app.factory('storageService', );
