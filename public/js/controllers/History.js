define(['jquery', 'app'], function ($, app) {
  "use strict";

  return app.controller('HistoryController',
    ['$scope', 'historyService', 'settingsService', 'dialogService',
    function (scope, historyService, settingsService, Dialog) {
      var detailsDialog;

      settingsService.get().then(function (settings) {
        scope.hourFormat = settings.ui.hours;
      });
      scope.entries = historyService.getHistory();
      scope.details = { finished: '', notes: '' };

      scope.showDetails = function () {
        scope.details = this.pomodori;
        detailsDialog.open();
      };
      scope.closeDetails = function () {
        detailsDialog.close();
      };

      scope.$on('$includeContentLoaded', function () {
        detailsDialog = new Dialog($('#detailsDialog'));
      });
  }]);
});
