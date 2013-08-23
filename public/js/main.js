/* global require */

/**
 * Main bootsrap file.
 */

"use strict";

require.config({
  paths: {
    'jquery':           'vendor/jquery',
    // 'foundation':       'vendor/foundation.min',
    'foundation': 'vendor/foundation/foundation',
    'foundation-joyride': 'vendor/foundation/foundation.joyride',
    'foundation-cookie': 'vendor/foundation/foundation.cookie',
    'foundation-dropdown': 'vendor/foundation/foundation.dropdown',
    'foundation-reveal': 'vendor/foundation/foundation.reveal',
    'angular':          'vendor/angular.min',
    'angular-cookies':  'vendor/angular-cookies.min',
    'angular-route':  'vendor/angular-route.min',
    'angular-animate':  'vendor/angular-animate.min'
  },
  shim: {
    angular: {
      exports: 'angular'
    }
  },
  priority: ['angular']
});

require(['jquery', 'angular', 'app'], function ($, angular) {
  $(function () {
    function allComponents () {
      var components = {
        routes:       ['Routes'],
        filters:      ['Filter'],
        controllers:  ['History', 'Settings', 'Timer', 'Today', 'Sound', 'SignIn'],
        services:     ['Notification', 'Pomodoro', 'Settings', 'Storage', 'TimeMaster',
                        'History', 'Dialog', 'Favicon', 'User', 'Calendar', 'DataExport']
      },
      paths = function(i) {
        return function (j) { return i + '/' + j; };
      },
      all = [];

      for (var i in components) {
        if (components.hasOwnProperty(i)) {
          all = all.concat(components[i].map(paths(i)));
        }
      }

      return all;
    }

    require(allComponents(), function () {
      angular.bootstrap(document, ['tomatar']);
    });
  });
});
