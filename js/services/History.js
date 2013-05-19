define(['app'], function (app) {
  "use strict";

  var storageKey = 'history';

  return app.factory('historyService', ['$rootScope', 'storageService', function (rootScope, storageService) {
    var entries = storageService.getJSON(storageKey) || {};
    var todayKey = today();
    entries[todayKey] || (entries[todayKey] = []);

    var todaysEntries = entries[todayKey];

    function today () {
      var now = new Date();

      return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
    }

    function timestamp () {
      var now = new Date();

      return now.getHours() + ':' + now.getMinutes();
    }

    function save (entries) {
      storageService.setJSON(storageKey, entries);

      rootScope.$broadcast(storageKey + 'Saved', entries);
    }

    return {
      getToday: function () {
        return todaysEntries;
      },
      getHistory: function () {

      },
      saveToToday: function (newEntry) {
        newEntry.finished = timestamp();
        todaysEntries.push(newEntry);
        save(entries);

        return todaysEntries;
      },
      get: function () {
        return storageService.getJSON(storageKey) || defaults;
      }
    };
  }]);
});
