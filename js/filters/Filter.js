define(['app'], function (app) {
  "use strict";

  return app.filter('padSeconds', function () {
    return function (input) {
      return (input < 10) ? '0' + input : input;
    };
  });
});
