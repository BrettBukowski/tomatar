define(['app'], function (app) {
  "use strict";

  return app.factory('notificationService', ['$window', function (win) {
    var factory = {
      available: function () {
        return 'Notification' in win;
      },

      requestPermission: function (callback) {
        win.Notification.requestPermission(function (response) {
          callback(response == 'granted');
        });
      },

      display: function (title, body) {
        if (this.available()) {
          new win.Notification(title, { iconUrl: 'img/icon.png', body: body });
        }
      }
    };

    return factory;
  }]);
});
