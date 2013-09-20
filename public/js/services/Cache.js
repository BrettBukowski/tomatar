define(['app', 'services/Storage'], function (app) {
  "use strict";

  return app.factory('cacheService', ['storageService', function (storageService) {
    function Cache (storage) {
      this.ttl = 120000;  // 2 minutes
      this.ttls = {};
      this.entries = {};
      this.storage = storage;
    }
    Cache.prototype.set = function (key, value) {
      this.entries[key] = value;
      this.storage.setJSON(key, value);
      return value;
    };
    Cache.prototype.setWithTTL = function (key, value) {
      this.setTTL(key);
      return this.set(key, value);
    };
    Cache.prototype.setTTL = function (key) {
      this.ttls[key] = (+ new Date());
    };
    Cache.prototype.get = function (key) {
      if (this.ttlExpired(key)) return;
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
    Cache.prototype.ttlExpired = function (key) {
      var expire = this.ttls[key];
      if (expire && (+new Date()) > expire + this.ttl) {
        this.ttls[key] = null;
        this.remove(key);
        return true;
      }
      return false;
    };

    return new Cache(storageService);
  }]);
});
