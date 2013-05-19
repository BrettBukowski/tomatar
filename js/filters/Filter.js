define(['app'], function (app) {
  "use strict";

  function pad (input) {
    return (input < 10) ? '0' + input : input;
  }

  function formatTime (hour, minute) {
    return hour + ':' + minute;
  }

  return app.filter('padSeconds', function () {
    return function (input) {
      if (typeof input === 'number') return pad(input);

      var split = input.split(':');
      return formatTime(split[0], pad(split[1]));
    };
  }).filter('timeInterval', function () {
    return function (endTime, minutesToSubtract) {
      var split = endTime.split(':'),
          hour = split[0],
          minutes = split[1];

      minutes -= minutesToSubtract;
      while (minutes < 0) {
        if (--hour == 0) hour = 12;
        minutes = 60 + minutes;
      }

      return formatTime(hour, minutes);
    };
  }).filter('truncate', function () {
    var truncationLimit = 40;
    return function (input, truncate) {
      if (input.length <= truncationLimit) return input;

      return input.substr(0, (truncate || truncationLimit) - 1) + '…';
    };
  });
});
