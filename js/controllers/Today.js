define(['jquery', 'app'], function ($, app) {
  "use strict";

  return app.controller('TodayController',
    ['$rootScope', '$scope', 'historyService', 'settingsService', 'dialogService',
    function (rootScope, scope, historyService, settingsService, Dialog) {
    var finishedDialog = new Dialog($('#finishedDialog')),
        detailsDialog;

    scope.hourFormat = settingsService.get().ui.hours;
    scope.completed = historyService.getToday();
    scope.notes = '';
    scope.details = { finished: '', notes: '' };

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
    scope.$on('$includeContentLoaded', function () {
      detailsDialog = new Dialog($('#detailsDialog'));
    });
  }]);
});
