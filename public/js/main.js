/* global require */

/**
 * Main bootstrap file.
 */

"use strict";

require.config({
  paths: {
    'jquery':               'vendor/foundation/js/vendor/jquery',
    'jquery-cookie':        'vendor/foundation/js/vendor/jquery.cookie',
    'foundation':           'vendor/foundation/js/foundation/foundation',
    'foundation-joyride':   'vendor/foundation/js/foundation/foundation.joyride',
    'foundation-dropdown':  'vendor/foundation/js/foundation/foundation.dropdown',
    'foundation-reveal':    'vendor/foundation/js/foundation/foundation.reveal',
    'angular':              'vendor/angular/angular',
    'angular-cookies':      'vendor/angular-cookies/angular-cookies',
    'angular-route':        'vendor/angular-route/angular-route',
    'angular-animate':      'vendor/angular-animate/angular-animate'
  },
  shim: {
    'angular':              { exports: 'angular', deps: ['jquery'] },
    'foundation':           { exports: 'Foundation', deps: ['jquery'] },
    'angular-cookies':      ['angular'],
    'angular-route':        ['angular'],
    'angular-animate':      ['angular'],
    'jquery-cookie':        ['foundation'],
    'foundation-joyride':   ['foundation', 'jquery-cookie'],
    'foundation-dropdown':  ['foundation'],
    'foundation-reveal':    ['foundation']
  },
  priority: ['angular']
});

require(['angular', 'controllers/App'], function (angular, appController) {
  appController();
  angular.bootstrap(document, ['tomatar']);
});
