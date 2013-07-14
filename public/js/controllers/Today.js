define(['jquery', 'app'], function ($, app) {
  "use strict";

  return app.controller('TodayController',
    ['$rootScope', '$scope', 'historyService', 'settingsService', 'dialogService',
    function (rootScope, scope, historyService, settingsService, Dialog) {
    var finishedDialog = new Dialog($('#finishedDialog')),
        detailsDialog;

    function completedTimeInterval (evt, wasPomo, howLong) {
      if (!wasPomo) return; // TK show something on the UI?

      scope.howLong = howLong;
      finishedDialog.open();
    }

    function saveEntry () {
      scope.completed = historyService.saveToToday({
        notes:    scope.notes,
        duration: scope.howLong
      });

      scope.notes = '';
    }

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

    settingsService.get().then(function (settings) {
      scope.hourFormat = settings.ui.hours;
      !scope.$$phase && scope.$apply();
    });
    historyService.getToday().then(function (completed) {
      scope.completed;
      !scope.$$phase && scope.$apply();
    });
    scope.notes = '';
    scope.details = { finished: '', notes: '' };

    scope.$on('timeInterval:complete', completedTimeInterval);
    scope.$on('finishedDialogClosed', saveEntry);
    scope.$on('$includeContentLoaded', function () {
      detailsDialog = new Dialog($('#detailsDialog'));
    });
  }]);
});
