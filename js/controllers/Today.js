define(['jquery', 'app'], function ($, app) {
  "use strict";

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


  return app.controller('TodayController', ['$rootScope', '$scope', 'historyService', function (rootScope, scope, historyService) {
    var dialog = new Dialog($('#finishedDialog'));
    var alreadyCompleted = historyService.getToday();

    function completedTimeInterval (evt, wasPomo, howLong) {
      if (!wasPomo) return; // TK show something on the UI?

      scope.howLong = howLong;
      dialog.open();
    }


    scope.saveEntry = function () {
      historyService.saveToToday({
        interval: scope.howLong,
        notes: scope.notes
      });
    };

    scope.skipEntry = function () {
      scope.notes = '';
      dialog.close();
    };

    scope.notes = '';

    rootScope.$on('timeInterval:complete', completedTimeInterval);
    rootScope.$on('finishedDialogClosed', scope.saveEntry);
  }]);
});
