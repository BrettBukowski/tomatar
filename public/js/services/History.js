define(['app', 'angular'], function (app, angular) {
  "use strict";

  var localStorageKey = 'localHistory',
      syncedStorageKey = 'syncedHistory';

  function today () {
    var now = new Date();

    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  }

  function timestamp () {
    var now = new Date();

    return now.getHours() + ':' + now.getMinutes();
  }

  return app.service('historyService', ['$rootScope', 'storageService', 'userService', 'calendarService', '$q',
    function (rootScope, storageService, userService, calendarService, Q) {

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
      return userService.getPomodoro().then(function (results) {
        return calendarService.partition(results);
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
