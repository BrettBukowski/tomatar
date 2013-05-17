define(['angular'], function (angular) {
  "use strict";

  return angular.module('tomatar', [])
    .run(['$rootScope', 'timeService', function (rootScope, TimeMaster) {
      rootScope.$on('timer', TimeMaster.timerFinished);
    }]);
});
