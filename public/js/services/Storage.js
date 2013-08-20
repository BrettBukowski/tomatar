define(['app', 'angular'], function (app, angular) {
  "use strict";

  return app.service('storageService', ['$window', '$document', function (win, doc) {
      this.available = 'localStorage' in win;

      this.get = function (key) {
        return win.localStorage.getItem(key);
      };

      this.set = function (key, value) {
        return win.localStorage.setItem(key, value);
      };

      this.remove = function (key) {
        return win.localStorage.removeItem(key);
      };

      this.setJSON = function (key, value) {
        return this.set(key, angular.toJson(value));
      };

      this.getJSON = function (key) {
        return angular.fromJson(this.get(key));
      };

      this.saveTextFile = function (text, fileName) {
        var blob = new win.Blob([ text ], { type: 'text/plain' }),
            link = doc[0].createElement('a');

        link.download = fileName || 'download.txt';

        if (win.webkitURL) {
          link.href = win.webkitURL.createObjectURL(blob);
        }
        else {
          link.href = win.URL.createObjectURL(blob);
          // FF (and probably IE10) requires the link to exist in the DOM.
          link.style.display = 'none';
          link.onclick = function () {
            doc[0].body.removeChild(link);
            link = null;
          };
          doc[0].body.appendChild(link);
        }
        link.click();

        return link.href;
      };
  }]);
});
