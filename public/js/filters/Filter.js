define(['app', 'angular'], function (app, angular) {
  "use strict";

  var TRUNCATION_LIMIT = 40;
  var MONTHS = ['January', 'February', 'March', 'April', 'May',
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
        if (!--hour) hour = 12;
        minutes = 60 + minutes;
      }

      return formatTime(hour, minutes);
    },

    truncate: function (input, truncate) {
      var limit = truncate || TRUNCATION_LIMIT;

      if (!input) return '';

      return (input.length <= limit)
        ? input
        : input.substr(0, limit - 1) + '…';
    },

    formatTime: function (input, format) {
      if (format == 12) {
        var split = input.split(':');
        if (split[0] >= 12) {
          return formatTime(split[0] == 12 ? 12 : split[0] - 12, split[1], 'pm');
        }
        else {
          return formatTime(split[0].charAt(0) == '0' ? split[0].charAt(1) : split[0], split[1], 'am');
        }
      }

      return input;
    },

    /**
     * Month and year
     * @param  {String} input YYYY-MM OR YYYY-MM-DDT00:00:00.000Z
     * @return {String}       Month Year
     */
    formatMonthAndYear: function (input) {
      var split = input.split('-');

      if (split.length < 2) return input;

      return MONTHS[parseInt(split[1], 10) - 1] + ' ' + split[0];
    },

    /**
     * Month day year
     * @param  {String} input YYYY-MM-DDT00:00:00.000Z
     * @return {String}       Month day, year
     */
    formatDate: function (input) {
      var split = input.split('-');

      if (split.length != 3) return input;

      return MONTHS[parseInt(split[1], 10) - 1] + ' ' + parseInt(split[2], 10) + ', ' + split[0];
    },

    /**
     * Day of month
     * @param  {String} input YYYY-MM-DDT00:00:00.000Z
     * @return {String}       d
     */
    formatDayOfMonth: function (input) {
      var split = input.split('-');

      return parseInt(split[2], 10) + '';
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
