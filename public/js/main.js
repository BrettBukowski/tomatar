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
    'angular':              { exports: 'angular', deps: ['jquery'] },
    'foundation':           { exports: 'Foundation', deps: ['jquery'] },
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

require(['angular', 'controllers/App'], function (angular, appController) {
  appController();
  angular.bootstrap(document, ['tomatar']);
});
