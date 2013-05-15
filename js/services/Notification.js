define(['app'], function (app) {
  "use strict";

  return app.factory('notificationService', ['$window', function (win) {
    function permissionIsGranted () {
      // 0 is PERMISSION_ALLOWED
      return win.webkitNotifications.checkPermission() == 0;
    }

    var factory = {
      available: function () {
        return 'webkitNotifications' in win;
      },

      requestPermission: function (callback) {
        if (permissionIsGranted()) return callback(true);

        win.webkitNotifications.requestPermission(function () {
          callback(permissionIsGranted());
        });
      },
      display: function (title, body) {
        if (permissionIsGranted()) {
          win.webkitNotifications.createNotification('icon.png', title, body);
        }
      }
    };

    return factory;
  }]);
});
