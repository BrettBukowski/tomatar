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

      display: function (labels) {
        if (this.available()) {
          new win.Notification(labels.title || 'Error Title', {
            iconUrl: '/img/appicon.png',
            body:     labels.body || 'Error Body'
          });
        }
      }
    };

    return factory;
  }]);
});
