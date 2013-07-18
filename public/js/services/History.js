define(['app', 'angular'], function (app, angular) {
  "use strict";

  var localStorageKey = 'local',
      syncedStorageKey = 'synced';

  function today () {
    var now = new Date();

    return [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
  }

  function timestamp () {
    var now = new Date();

    return [now.getHours(), now.getMinutes()].join(':');
  }

  function cleanRemoteEntries (entries) {
    return entries.map(function (entry) {
      return {
        id:       entry.id,
        notes:    entry.notes,
        duration: entry.duration,
        time:     entry.time.match(/[\d]{2}:[\d]{2}/)[0],
        date:     entry.date.match(/[\d]{4}-[\d]{2}-[\d]{2}/)[0]
      }
    });
  }

  function Cache (storage) {
    this.entries = {};
    this.storage = storage
  }
  Cache.prototype.set = function (key, value) {
    this.entries[key] = value;
    this.storage.setJSON(key, value);
    return value;
  };
  Cache.prototype.get = function (key) {
    return this.entries[key] || (this.entries[key] = this.storage.getJSON(key));
  };
  Cache.prototype.add = function (key, value) {
    if (this.entries[key]) {
      // Newest first.
      this.entries[key].unshift(value);
      this.storage.setJSON(key, value);

      return true;
    }

    return false;
  };
  Cache.prototype.remove = function (key) {
    this.entries[key] = null;
    this.storage.remove(key);
  };

  return app.service('historyService', ['$rootScope', 'storageService', 'userService', 'calendarService', '$q',
    function (rootScope, storageService, userService, calendarService, Q) {

    var cache = new Cache(storageService);

    function promise (resolved) {
      var deferred = Q.defer();
      deferred.resolve(resolved);
      return deferred.promise;
    }

    function saveRemote (entry) {
      entry.date = today();
      entry.finished = timestamp();

      return userService.savePomodoro(entry).then(function () {
        afterSaveRemote(syncedStorageKey, entry);
      }, function () {
        // User isn't signed in.
        afterSaveRemote(localStorageKey, entry);
      });
    }

    function afterSaveRemote (key, entry) {
      cache.add(key, entry) || cache.set(key, [ entry ]);
      rootScope.$broadcast('historySaved');
    }

    function sync (entries) {
      userService.syncPomodori(entries).then(function () {
        cache.remove(localStorageKey);
      });
    }

    this.getToday = function () {
      return this.getHistory().then(function (history) {
        return history[0].days[0].finished;
      });
    };

    this.getHistory = function () {
      var cachedEntries = cache.get(syncedStorageKey);
      if (cachedEntries) return promise(calendarService.partition(cachedEntries));

      return userService.getPomodoro().then(function (results) {
        cache.set(syncedStorageKey, cleanRemoteEntries(results));

        var unsyncedEntries = cache.get(localStorageKey);
        if (unsyncedEntries) {
          sync(unsyncedEntries);
        }

        return calendarService.partition(results);
      }, function () {
        // User isn't signed in.
        return calendarService.partition(cache.get(localStorageKey));
      });
    };

    this.saveToToday = function (newEntry) {
      saveRemote(newEntry);
    };
  }]);
});
