define(['jquery', 'app'], function ($, app) {
  "use strict";

  return app.factory('notificationService', ['$window', function (win) {
    var currentNotification;
    var factory = {
      close: function () {
        if (currentNotification) {
          currentNotification.close();
          currentNotification = null;
          $(window).off('focus', this.close);
        }
      },

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
          currentNotification = new win.Notification(labels.title || 'Error Title', {
            iconUrl: '/img/appicon.png',
            body:     labels.body || 'Error Body'
          });
          currentNotification.onclick = function () { window.focus(); };
          $(window).on('focus', this.close);
        }
      }
    };

    return factory;
  }]);
});
