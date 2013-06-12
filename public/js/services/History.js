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

  return app.factory('historyService', ['$rootScope', 'storageService', function (rootScope, storageService) {
    var todayKey = today(),
        entries = storageService.getJSON(storageKey) || {};

    entries[todayKey] || (entries[todayKey] = []);

    var todaysEntries = entries[todayKey],
        pastEntries = utils.omit(entries, todayKey);

    function save (entries) {
      storageService.setJSON(storageKey, entries);

      rootScope.$broadcast(storageKey + 'Saved', entries);
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
        save(entries);

        return todaysEntries;
      },
      get: function () {
        return storageService.getJSON(storageKey) || {};
      }
    };
  }]);
});
