define(['app', 'angular'], function (app, angular) {
  "use strict";

  var localStorageKey = 'local',
      syncedStorageKey = 'synced';

  function cleanRemoteEntries (entries) {
    return entries.map(function (entry) {
      return {
        id:       entry.id,
        notes:    entry.notes,
        duration: entry.duration,
        time:     entry.time.match(/[\d]{2}:[\d]{2}/)[0],
        date:     entry.date.match(/[\d]{4}-[\d]{2}-[\d]{2}/)[0]
      };
    });
  }

  function Cache (storage) {
    this.entries = {};
    this.storage = storage;
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
    var cachedSet = this.entries[key];
    if (cachedSet) {
      // Newest first.
      cachedSet.unshift(value);
      this.storage.setJSON(key, cachedSet);

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
      function problemSavingRemote () {
        afterSaveRemote(localStorageKey, entry);
        return entry;
      }

      return userService.savePomodoro(entry).then(function (saved) {
        if (saved && saved.id) {
          afterSaveRemote(syncedStorageKey, saved);
          return saved;
        }
        return problemSavingRemote();
      }, function () {
        // User isn't signed in.
        return problemSavingRemote();
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

    // YYYY-MM-DD
    this.getDate = function (date) {
      var parts = date.split('-'),
          month = parts.slice(0, 2).join('-'),
          day = parts[2];

      return this.getHistory().then(function (history) {
        var requested = [];

        history.some(function (currentMonth) {
          if (currentMonth.month == month) {
            currentMonth.days.some(function (currentDay) {
              if (currentDay.dayOfMonth == day) {
                requested = currentDay.finished;
                return true;
              }
            });
            return true;
          }
        });
        return requested;
      });
    };

    this.getHistory = function () {
      var cachedEntries = cache.get(syncedStorageKey);
      if (cachedEntries) {
        return promise(calendarService.partition(cachedEntries.concat(cache.get(localStorageKey))));
      }

      return userService.getPomodoro().then(function (results) {
        cache.set(syncedStorageKey, cleanRemoteEntries(results));

        var unsyncedEntries = cache.get(localStorageKey);
        if (unsyncedEntries) {
          sync(unsyncedEntries);
        }

        return calendarService.partition(results);
      }, function () {
        // User isn't signed in.
        return calendarService.partition(cache.get(localStorageKey).concat(cache.get(syncedStorageKey)));
      });
    };

    this.saveToToday = function (newEntry) {
      return saveRemote(newEntry);
    };
  }]);
});
