define(['jquery', 'app', 'services/History', 'services/Settings', 'services/Dialog'], function ($, app) {
  "use strict";

  function doubleDigits (value) {
    return (value < 10) ? '0' + value : value;
  }

  function today () {
    var now = new Date();

    return [now.getFullYear(), doubleDigits(now.getMonth() + 1),
      doubleDigits(now.getDate())].join('-');
  }

  function timestamp () {
    var now = new Date();

    return [now.getHours(), doubleDigits(now.getMinutes())].join(':');
  }

  return app.controller('TodayController',
    ['$rootScope', '$scope', 'historyService', 'settingsService', 'dialogService',
    function (rootScope, scope, historyService, settingsService, Dialog) {
    var finishedDialog = new Dialog($('#finishedDialog')),
        detailsDialog;

    function completedTimeInterval (evt, wasPomo, howLong) {
      if (!wasPomo) return; // TK show something on the UI?

      scope.howLong = howLong;

      finishedDialog.open();

      scope.completed.push({
        notes:    '',
        duration: scope.howLong,
        time:     timestamp()
      });
    }

    function saveEntry () {
      var newEntry = scope.completed[scope.completed.length - 1];

      historyService.saveToToday({
        notes:    scope.notes,
        duration: newEntry.duration,
        date:     today(),
        time:     newEntry.time
      });

      newEntry.notes = scope.notes;

      // Reset dialog's notes field.
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
    historyService.getDate(today()).then(function (completed) {
      scope.completed = completed;
      !scope.$$phase && scope.$apply();
    });

    // Dialog's notes field.
    scope.notes = '';
    // Detail dialog's fields.
    scope.details = { time: '', notes: '' };

    scope.$on('timeInterval:complete', completedTimeInterval);
    scope.$on('finishedDialogClosed', saveEntry);
    scope.$on('$includeContentLoaded', function () {
      detailsDialog = new Dialog($('#detailsDialog'));
    });
  }]);
});
