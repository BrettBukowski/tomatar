'use strict';

var db = require('../database'),
    Q = require('q'),
    dates = require('../dateFormatting'),
    client;

db.orm.table('pomodori')
  .columns(['id', 'user_id', 'notes', 'date', 'time', 'duration'])
  .join('users').oneToOne('users').on({ user_id: 'id' });

client = db.createClient('pomodori');

function guardUserAssociation (user) {
  if (!user || !user.id) return Q.fcall(function () { throw "Invalid user supplied"; });
}

function dataForCreate (pom) {
  var copy = {};
  for (var prop in pom) {
    if (typeof pom[prop] != 'function') {
      if (prop == 'user') {
        copy.user_id = pom[prop].id;
      }
      else {
        copy[prop] = pom[prop];
      }
    }
  }

  return { data: copy };
}


function guardDateRange (range) {
  if (!dates.validate(range.start)) return "Invalid start date: " + range.start;
  if (range.end && !dates.validate(range.end)) return "Invalid end date: " + range.end;
}

module.exports = Pomodoro;

function Pomodoro (props) {
  if (props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
}

Pomodoro.prototype.save = function (user) {
  this.user = user;

  if (this.id) return Pomodoro.update(this);
  return Pomodoro.create(this);
};

Pomodoro.create = function (pomodoro) {
  var error = guardUserAssociation(pomodoro.user);
  if (error) return error;

  return client.create(dataForCreate(pomodoro)).then(function (result) {
    pomodoro.id = result.id;

    return pomodoro;
  });
};

Pomodoro.update = function (pomodoro) {
  return client.update({ criteria: { id: pomodoro.id }, data: pomodoro }).then(function () {
    return pomodoro;
  });
};

Pomodoro.destroy = function (pomodoro) {
  return client.remove(pomodoro.id);
};

/**
 * Get pomodoro sessions for the given range.
 * Defaults to a month if no end is specified.
 * @param  {Object} range Obj literal with:
 *                        -start: String YYYY-MM
 *                        -end: String YYYY-MM (optional)
 * @param  {Object} user  Owner
 * @return {Array} Results
 */
Pomodoro.getInDateRangeForUser = function (range, user) {
  var error = guardDateRange(range);
  if (error) return Q.fcall(function () { throw new Error(error); });

  return client.findMany({
    criteria: {
      date:    { BETWEEN: dates.convertDateRange(range) },
      user_id: user.id
    }
  }).then(function (results) {
    return results.rows;
  });
};

Pomodoro.getAllForUser = function (user) {
  return client.findMany({ criteria: { user_id: user.id }}).then(function (results) {
    return results.rows;
  });
};
