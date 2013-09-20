define(['app', 'services/Cache', 'services/User', 'services/Calendar'], function (app) {
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

  return app.service('historyService', ['$rootScope', 'cacheService', 'userService', 'calendarService', '$q',
    function (rootScope, cache, userService, calendarService, Q) {

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
      userService.syncPomodori(entries).then(function (synced) {
        cache.set(syncedStorageKey, (cache.get(syncedStorageKey) || []).concat(synced));
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
        cache.setTTL(syncedStorageKey);
        return promise(calendarService.partition(cachedEntries.concat(cache.get(localStorageKey))));
      }

      return userService.getPomodoro().then(function (results) {
        cache.setWithTTL(syncedStorageKey, cleanRemoteEntries(results));

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

    this.sync = function () {
      var unsyncedEntries = cache.get(localStorageKey);
      if (unsyncedEntries) {
        sync(unsyncedEntries);
      }
    };

    this.destroy = function () {
      cache.remove(localStorageKey);
      cache.remove(syncedStorageKey);
    };
  }]);
});
