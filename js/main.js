/**
 * Main bootsrap file.
 */

"use strict";

require.config({
  paths: {
    jquery:     'vendor/jquery',
    foundation: 'vendor/foundation.min',
    angular:    'vendor/angular.min'
  },
  shim: {
    angular: {
      exports: 'angular'
    }
  },
  priority: ['angular']
});

require(['jquery', 'foundation', 'angular', 'app'], function ($, foundation, angular) {
  $(function () {
    $(document).foundation();

    function allComponents () {
      var components = {
        routes:      ['routes/Routes'],
        filter:      ['filters/Filter'],
        controller:  ['controllers/History', 'controllers/Settings', 'controllers/Timer', 'controllers/Today'],
        factory:     ['services/Notification', 'services/Pomodoro', 'services/Settings', 'services/Storage'],
      };

      var all = [];
      for (var i in components) {
        if (components.hasOwnProperty(i)) {
          all = all.concat(components[i]);
        }
      }

      return all;
    }

    require(allComponents(), function () {
      angular.bootstrap(document, ['tomatar']);
    });
  });
});
