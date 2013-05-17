define(['app'], function (app) {
  "use strict";

  return app.factory('soundService', ['$window', 'settingsService' function (win, settingsService) {
    var path = 'audio';

    var factory = {
      play: function () {
      }
    };

    return factory;
  }]);
});
