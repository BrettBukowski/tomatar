var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return /Spec\.js$/.test(file);
});

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/public/js',
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

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});

define('app', function () {
  return angular.module('tomatar', []);
});
