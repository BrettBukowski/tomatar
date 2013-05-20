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


  return app.controller('TodayController',
    ['$rootScope', '$scope', 'historyService', 'settingsService',
    function (rootScope, scope, historyService, settingsService) {
    var finishedDialog = new Dialog($('#finishedDialog')),
        detailsDialog = new Dialog($('#detailsDialog'));

    scope.hourFormat = settingsService.get().ui.hours;
    scope.completed = historyService.getToday();
    scope.notes = '';
    scope.details = {};

    function completedTimeInterval (evt, wasPomo, howLong) {
      if (!wasPomo) return; // TK show something on the UI?

      scope.howLong = howLong;
      finishedDialog.open();
    }

    scope.saveEntry = function () {
      scope.completed = historyService.saveToToday({
        notes:    scope.notes,
        duration: scope.howLong
      });

      scope.notes = '';
    };

    scope.closeDialog = function () {
      finishedDialog.close();
    };

    scope.skipEntry = function () {
      scope.notes = '';
      finishedDialog.close();
    };

    scope.showDetails = function () {
      scope.details = this.pomodori;
      detailsDialog.open();
    };

    scope.closeDetails = function () {
      detailsDialog.close();
    };

    rootScope.$on('timeInterval:complete', completedTimeInterval);
    rootScope.$on('finishedDialogClosed', scope.saveEntry);
  }]);
});
