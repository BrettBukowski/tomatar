define(['app', 'angular'], function (app, angular) {
  "use strict";

  var truncationLimit = 40;
  var months = ['January', 'February', 'March', 'April', 'May',
   'June', 'July', 'August', 'September', 'October', 'November', 'December'];


  function pad (input) {
    return (input < 10) ? '0' + input : input;
  }

  function formatTime (hour, minute, suffix) {
    return hour + ':' + minute + ((suffix) ? ' ' + suffix : '');
  }

  var filters = {
    padSeconds: function (input) {
      if (typeof input === 'number') return pad(input);

      var split = input.split(':');
      return formatTime(split[0], pad(split[1]));
    },

    timeInterval: function (endTime, minutesToSubtract) {
      var split = endTime.split(':'),
          hour = split[0],
          minutes = split[1];

      minutes -= minutesToSubtract;
      while (minutes < 0) {
        if (--hour == 0) hour = 12;
        minutes = 60 + minutes;
      }

      return formatTime(hour, minutes);
    },

    truncate: function (input, truncate) {
      if (input.length <= truncationLimit) return input;

      return input.substr(0, (truncate || truncationLimit) - 1) + '…';
    },

    formatTime: function (input, format) {
      if (format == 12) {
        var split = input.split(':');
        if (split[0] > 12) {
          return formatTime(split[0] - 12, split[1], 'pm');
        }
        else {
          return formatTime(split[0], split[1], 'am');
        }
      }

      return input;
    },

    formatDate: function (input) {
      // Expecting YYYY-MM-DD
      var split = input.split('-');

      return months[parseInt(split[1], 10) - 1] + ' ' + split[2] + ', ' + split[0];
    }
  };

  function wrap (func) {
    return function () {
      return func;
    };
  }

  angular.forEach(filters, function (func, name) {
    app.filter(name, wrap(func));
  });

  return app;
});
