define(['app'], function (app) {
  "use strict";

  return app.factory('dialogService', function () {
    function Dialog (el) {
      this.el = el;
    }
    Dialog.prototype._reveal = function (action) {
      this.el.foundation('reveal', action);
    };
    Dialog.prototype.close = function () {
      this._reveal('close');
    };
    Dialog.prototype.open = function () {
      this._reveal('open');
    };

    return Dialog;
  });
});
