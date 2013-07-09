define(['app', 'utils'], function (app, utils) {
  "use strict";

  var storageKey = 'history';

  function today () {
    var now = new Date();

    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  }

  function timestamp () {
    var now = new Date();

    return now.getHours() + ':' + now.getMinutes();
  }

  return app.factory('historyService', ['$rootScope', 'storageService', 'userService',
    function (rootScope, storageService, userService) {
    var todayKey = today(),
        entries = storageService.getJSON(storageKey) || {};

    entries[todayKey] || (entries[todayKey] = []);

    var todaysEntries = entries[todayKey],
        pastEntries = utils.omit(entries, todayKey);

    function saveLocal (entries) {
      storageService.setJSON(storageKey, entries);

      rootScope.$broadcast(storageKey + 'Saved', entries);
    }

    function saveRemote (entry) {
      if (userService.signedIn()) {
        entry.date = today();
        userService.savePomodoro(entry);
      }
    }

    return {
      getToday: function () {
        return todaysEntries;
      },
      getHistory: function () {
        return pastEntries;
      },
      saveToToday: function (newEntry) {
        newEntry.finished = timestamp();
        todaysEntries.push(newEntry);
        saveLocal(entries);
        saveRemote(newEntry);

        return todaysEntries;
      },
      get: function () {
        return storageService.getJSON(storageKey) || {};
      }
    };
  }]);
});
