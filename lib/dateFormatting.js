'use strict';


/**
 * YYYY-MM → Date
 * @param  {String} str Valid date string
 * @return {Object}     Date
 */
function convertToDate (str) {
  var pieces = str.split('-');

  return new Date(parseInt(pieces[0], 10), parseInt(pieces[1], 10) - 1);
}

module.exports = {
  /**
   * Legit dates:
   * YYYY-MM
   * YYYY-M
   * @param  {String} date Date string
   * @return {Boolean}
   */
  validate: function (date) {
    return (/\d{4}-\d{1,2}/).test(date);
  },

  /**
   * Creates a range array from the given obj literal.
   * The end range defaults to a month after the start date.
   * @param  {Object} range With:
   *                        -start: Valid date string
   *                        -end: Valid date string (optional)
   * @return {array}       [ start, end ]
   */
  convertDateRange: function (range) {
    var start = convertToDate(range.start), end;

    if (range.end) {
      end = convertToDate(range.end);
    }
    else {
      end = new Date(+start);
      end.setMonth(end.getMonth() + 1);
    }

    return [ start, end ];
  }
};
