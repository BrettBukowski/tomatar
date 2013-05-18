define(['app'], function (app) {
  "use strict";

  var storageKey = 'history';

  return app.factory('historyService', ['$rootScope', 'storageService', function (rootScope, storageService) {
    return {
      getToday: function () {

      },
      getHistory: function () {

      },
      saveToToday: function () {

      },
      get: function () {
        return storageService.getJSON(storageKey) || defaults;
      },

      save: function (settings) {
        storageService.setJSON(storageKey, settings);

        rootScope.$broadcast(storageKey + 'Saved', settings);
      }
    };
  }]);
});
