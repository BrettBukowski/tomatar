define(['jquery', 'app'], function ($, app) {
  "use strict";

  return app.controller('HistoryController',
    ['$scope', 'historyService', 'settingsService', 'dialogService',
    function (scope, historyService, settingsService, Dialog) {
      var detailsDialog;

      settingsService.get().then(function (settings) {
        scope.hourFormat = settings.ui.hours;
      });

      historyService.getHistory().then(function (entries) {
        scope.entries = entries;
        !scope.$$phase && scope.$apply();
      }, function () {
        scope.entries = {};
      });

      scope.details = { finished: '', notes: '' };

      scope.initDayDetail = function () {
        scope.dayDetail = { date: '', details: [] };
      };


      scope.showDetails = function () {
        scope.details = this.pomodori;
        scope.details.finished = this.pomodori.time;
        detailsDialog.open();
      };

      scope.closeDetails = function () {
        detailsDialog.close();
      };

      scope.showDayDetail = function () {
        scope.dayDetail = {
          // All finished sessions will share the same date.
          date:    this.day.finished[0].date,
          details: this.day.finished
        };
      };

      scope.hideDayDetail = function (e) {
        e.preventDefault();
        scope.initDayDetail();
      };

      scope.$on('$includeContentLoaded', function () {
        detailsDialog = new Dialog($('#detailsDialog'));
      });

      scope.initDayDetail();
  }]);
});
