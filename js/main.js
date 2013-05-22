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
  urlArgs: 'bust=' + (new Date()).getTime(),
  priority: ['angular']
});

require(['jquery', 'foundation', 'angular', 'app'], function ($, foundation, angular) {
  $(function () {
    function allComponents () {
      var components = {
        routes:       ['Routes'],
        filters:      ['Filter'],
        controllers:  ['History', 'Settings', 'Timer', 'Today', 'Sound'],
        services:     ['Notification', 'Pomodoro', 'Settings', 'Storage', 'TimeMaster',
                        'History', 'Dialog', 'Favicon']
      };

      var all = [];
      for (var i in components) {
        if (components.hasOwnProperty(i)) {
          all = all.concat(components[i].map(function (j) { return i + '/' + j; }));
        }
      }

      return all;
    }

    require(allComponents(), function () {
      angular.bootstrap(document, ['tomatar']);
    });
  });
});
