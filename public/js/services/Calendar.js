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

    return parts[0] + '-' + ((parts[1].length == 1) ? '0' + parts[1] : parts[1]);
  }

  /**
   * Returns index of the item in list
   * where the callback returns a truthy value.
   * @param  {array}   list List of items to search
   * @param  {Function} cb   callback supplied with ea. item
   * @return {number}        -1 if not found
   */
  function indexOf (list, cb) {
    var foundIndex = -1;
    list.some(function (item, index) {
      if (cb(item)) {
        foundIndex = index;
        return true;
      }
    });
    return foundIndex;
  }

  /**
   * Adds a new key-val to the supplied hash.
   * @param  {object} index    object literal
   *                           key → numerical index
   * @param  {string} newKey   new key
   * @param  {number} newValue new index
   * @return {object}          index with the added entry
   */
  function reIndex (index, newKey, newValue) {
    for (var i in index) {
      if (index[i] >= newValue) {
        index[i]++;
      }
    }
    index[newKey] = newValue;

    return index;
  }

  function Calendar () {
    this.monthIndex = {};
    this.months = [];
  }
  Calendar.prototype.insertEntry = function (pomodoro) {
    if (!pomodoro || !pomodoro.date) return;

    var monthString = getMonthAndYear(pomodoro.date),
        dayString = getDayOfMonth(pomodoro.date),
        month = this.getMonth(monthString) || this.insertMonth(monthString),
        day = month.getDay(dayString) || month.insertDay(dayString);

    day.insertEntry(pomodoro);
  };
  Calendar.prototype.getMonth = function (monthString) {
    return this.months[this.monthIndex[monthString]];
  };
  Calendar.prototype.insertMonth = function (monthString) {
    var newMonth = new Month(monthString),
        insertIndex = indexOf(this.months, function (month) {
          return month.month < newMonth.month;
        });

    insertIndex = (insertIndex == -1) ? this.months.length : insertIndex;

    this.months.splice(insertIndex, 0, newMonth);
    this.monthIndex = reIndex(this.monthIndex, monthString, insertIndex);

    return newMonth;
  };
  Calendar.prototype.getMonths = function () {
    return this.months;
  };

  function Month (monthString) {
    this.month = monthString;
    this.dayIndex = {};
    this.days = [];
  }
  Month.prototype.insertDay = function (dayString) {
    var newDay = new Day(dayString),
        insertIndex = indexOf(this.days, function (day) {
          return day.dayOfMonth > newDay.dayOfMonth;
        });

    if (insertIndex == -1) insertIndex = this.days.length;

    this.days.splice(insertIndex, 0, newDay);
    this.dayIndex = reIndex(this.dayIndex, dayString, insertIndex);

    return newDay;
  };
  Month.prototype.getDay = function (dayString) {
    return this.days[this.dayIndex[dayString]];
  };

  function Day (dayOfMonth) {
    this.dayOfMonth = dayOfMonth;
    this.finished = [];
  }
  Day.prototype.insertEntry = function (newEntry) {
    var insertIndex = indexOf(this.finished, function (entry) {
      return entry.time > newEntry.time;
    });

    this.finished.splice(insertIndex == -1 ? this.finished.length : insertIndex, 0, newEntry);
  };

  return app.factory('calendarService', [function () {

    return {
      /**
       * Create the initial calendar grouping.
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

        var calendar = new Calendar();
        angular.forEach(entries, calendar.insertEntry, calendar);
        return calendar.getMonths();
      }
    };

  }]);
});
