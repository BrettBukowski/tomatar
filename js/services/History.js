define(['app'], function (app) {
  "use strict";

  var storageKey = 'history';

  function indexOf (list, value) {
    for (var i = 0, len = list.length; i < len; i++) {
      if (list[i] == value) return i;
    }

    return -1;
  }

  function omit (obj) {
    var toOmit = Array.prototype.slice.call(arguments, 1),
        result = {}, i;

    for (i in obj) {
      if (obj.hasOwnProperty(i) && indexOf(toOmit, i) < 0) {
        result[i] = obj[i];
      }
    }

    return result;
  }

  function today () {
    var now = new Date();

    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
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
        pastEntries = omit(entries, todayKey);

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
        return storageService.getJSON(storageKey) || defaults;
      }
    };
  }]);
});
