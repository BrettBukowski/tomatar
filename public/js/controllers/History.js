define(['jquery', 'app', 'services/Settings', 'services/Dialog'], function ($, app) {
  "use strict";

  return app.controller('HistoryController',
    ['$scope', 'historyService', 'settingsService', 'dialogService', '$animate',
    function (scope, historyService, settingsService, Dialog, animateService) {
      var detailsDialog;

      function setAdjacentDay (index) {
        var nextDay = scope.dayDetail.month.days[index];

        if (nextDay) {
          setDayDetail(nextDay, index, scope.dayDetail.month);
          return true;
        }

        return false;
      }

      function setFirstDayFromNextMonth () {
        var nextMonth;
        scope.entries.some(function (month, i, months) {
          if (month.$$hashKey == scope.dayDetail.month.$$hashKey) {
            return nextMonth = months[i - 1];
          }
        });

        if (nextMonth) {
          setDayDetail(nextMonth.days[0], 0, nextMonth);
          return true;
        }

        return false;
      }

      function setLastDayFromPreviousMonth () {
        var prevMonth;
        scope.entries.some(function (month) {
          if (month.$$hashKey > scope.dayDetail.month.$$hashKey) {
            return prevMonth = month;
          }
        });

        if (prevMonth) {
          var lastDay = prevMonth.days.length - 1;
          setDayDetail(prevMonth.days[lastDay], lastDay, prevMonth);
          return true;
        }

        return false;
      }

      function setDayDetail (day, index, month) {
        scope.dayDetail = {
          // All finished sessions will share the same date.
          date:     day.finished[0].date,
          details:  day.finished,
          index:    index,
          month:    month
        };
      }

      settingsService.get().then(function (settings) {
        scope.hourFormat = settings.ui.hours;
      });

      historyService.getHistory().then(function (entries) {
        scope.entries = entries;
        !scope.$$phase && scope.$apply();
      }, function () {
        scope.entries = {};
      });

      scope.details = { time: '', notes: '' };

      scope.initDayDetail = function () {
        scope.dayDetail = { date: '', details: [] };
      };

      scope.showDetails = function () {
        scope.details = this.pomodori;
        detailsDialog.open();
      };

      scope.closeDetails = function () {
        detailsDialog.close();
      };

      scope.showDayDetail = function () {
        setDayDetail(this.day, this.$index, this.$parent.monthInterval);
      };

      scope.hideDayDetail = function (e) {
        e.preventDefault();
        scope.initDayDetail();
      };

      scope.nextDay = function () {
        setAdjacentDay(scope.dayDetail.index + 1) || setFirstDayFromNextMonth();
      };

      scope.previousDay = function () {
        setAdjacentDay(scope.dayDetail.index - 1) || setLastDayFromPreviousMonth();
      };

      scope.$on('$includeContentLoaded', function () {
        detailsDialog = new Dialog($('#detailsDialog'));
      });

      scope.initDayDetail();
  }]);
});
