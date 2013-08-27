/* global require */

/**
 * Main bootstrap file.
 */

"use strict";

require.config({
  paths: {
    'jquery':               'vendor/jquery',
    'foundation':           'vendor/foundation/foundation',
    'foundation-joyride':   'vendor/foundation/foundation.joyride',
    'foundation-cookie':    'vendor/foundation/foundation.cookie',
    'foundation-dropdown':  'vendor/foundation/foundation.dropdown',
    'foundation-reveal':    'vendor/foundation/foundation.reveal',
    'angular':              'vendor/angular.min',
    'angular-cookies':      'vendor/angular-cookies.min',
    'angular-route':        'vendor/angular-route.min',
    'angular-animate':      'vendor/angular-animate.min'
  },
  shim: {
    'angular':              { exports: 'angular' },
    'foundation':           { exports: 'Foundation' },
    'angular-cookies':      ['angular'],
    'angular-route':        ['angular'],
    'angular-animate':      ['angular'],
    'foundation-cookie':    ['foundation'],
    'foundation-joyride':   ['foundation', 'foundation-cookie'],
    'foundation-dropdown':  ['foundation'],
    'foundation-reveal':    ['foundation']
  },
  priority: ['angular']
});

require(['jquery', 'angular', 'bootstrap'], function ($, angular, bootstrap) {
  // Controllers called out in html.
  var controllers = [
    'SignIn', 'Settings', 'Sound', 'Timer'
  ].map(function (i) { return "controllers/" + i; });

  require(controllers, function () {
    bootstrap();
    angular.bootstrap(document, ['tomatar']);
  });
});
