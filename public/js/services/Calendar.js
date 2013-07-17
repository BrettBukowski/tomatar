define(['app', 'angular'], function (app, angular) {
  "use strict";

  /**
   * Day of month as int.
   * @param  {string} timestamp 2013-07-01T00:00:00.000Z
   * @return {Number}           int day of month
   */
  function getDayOfMonth (timestamp) {
    return parseInt(timestamp.split('-')[2], 10);
  }

  /**
   * Year and Month.
   * @param  {string} timestamp 2013-07-01T00:00:00.000Z
   * @return {string}           2013-07
   */
  function getMonthAndYear (timestamp) {
    var parts = timestamp.split('-');

    return parts[0] + '-' + parts[1];
  }

  function Calendar () {
    this.monthIndex = {};
    this.months = [];
  }
  Calendar.prototype.addEntry = function (pomodoro) {
    var monthString = getMonthAndYear(pomodoro.date),
        dayString = getDayOfMonth(pomodoro.date),
        month = this.getMonth(monthString) || this.addMonth(monthString),
        day = month.getDay(dayString) || month.addDay(dayString);

    day.addEntry(pomodoro);
  };
  Calendar.prototype.getMonth = function (monthString) {
    return this.months[this.monthIndex[monthString]];
  };
  Calendar.prototype.addMonth = function (monthString) {
    var month = new Month(monthString);
    this.monthIndex[monthString] = this.months.length;
    this.months.push(month);

    return month;
  };
  Calendar.prototype.getMonths = function () {
    return this.months;
  };

  function Month (monthString) {
    this.month = monthString;
    this.dayIndex = {};
    this.days = [];
  }
  Month.prototype.addDay = function (dayString) {
    var day = new Day(dayString);
    this.dayIndex[dayString] = this.days.length;
    this.days.unshift(day);

    return day;
  };
  Month.prototype.getDay = function (dayString) {
    return this.days[this.days.length - this.dayIndex[dayString] - 1];
  };

  function Day (dayOfMonth) {
    this.dayOfMonth = dayOfMonth;
    this.finished = [];
  }
  Day.prototype.addEntry = function (entry) {
    this.finished.push(entry);
  };

  return app.factory('calendarService', [function () {

    return {
      /**
       * @return {array} format:
       * [{
       *    month: 'YYYY-MM',
       *    days: [
       *      {
       *        dayOfMonth: Number,
       *        finished: [
       *          { time: 'HH:MM', notes: String, duration: Number, date: 'YYYY-MM-DDTTTT' },
       *          ...
       *        ]
       *      },
       *      ...
       *    ]
       *  },
       *  ...
       * ]
       */
      partition: function (entries) {
        if (!entries || !entries.length) return [];

        var calendar = new Calendar(entries);
        angular.forEach(entries, calendar.addEntry, calendar);
        return calendar.getMonths();
      }
    };

  }]);
});
