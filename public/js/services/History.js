define(['app', 'utils', 'angular'], function (app, utils) {
  "use strict";

  var localStorageKey = 'localHistory',
      syncedStorageKey = 'syncedHistory';

  function today () {
    var now = new Date();

    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  }

  function thisMonth () {
    var now = today().split('-');

    return now.slice(0, 2).join('-');
  }

  function timestamp () {
    var now = new Date();

    return now.getHours() + ':' + now.getMinutes();
  }

  return app.service('historyService', ['$rootScope', 'storageService', 'userService', '$q',
    function (rootScope, storageService, userService, Q) {

    function saveLocal (entries, synced) {
      storageService.setJSON(synced ? syncedStorageKey : localStorageKey, entries);

      rootScope.$broadcast('historySaved', entries);
    }

    function saveRemote (entry) {
      entry.date = today();
      return userService.savePomodoro(entry);
    }

    this.getToday = function () {

    };

    this.getHistory = function () {
      var month = thisMonth();
      return userService.getPomodoro(month).then(function (results) {
        var entries = {};

        angular.forEach(results, function (session) {
          // 2013-07-01T00:00:00.000Z
          var day = session.date.split('-')[2];
          day = parseInt(day, 10);
          entries[day] || (entries[day] = []);
          entries[day].push(session);
        });

        return entries;
      }).then(function (entries) {
        var days = [];
        angular.forEach(entries, function (poms, day) {
          days.push({
            dayOfMonth: day,
            finished: poms
          })
        });

        return days;
      }).then(function (days) {
        return [{
            month: month,
            days: days
        }];
      });
    };

    this.saveToToday = function (newEntry) {
      newEntry.finished = timestamp();

      saveRemote(newEntry).then(function () {
        // saveLocal(entries, true);
      }, function () {
        // saveLocal(entries, false);
      });

    };
  }]);
});
