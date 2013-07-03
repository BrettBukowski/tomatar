'use strict';

var db = require('../database'),
    Q = require('q'),
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

Pomodoro.getInDateRangeForUser = function (range, user) {

};

Pomodoro.getAllForUser = function (user) {
  return client.findMany({ criteria: { user_id: user.id }});
};
