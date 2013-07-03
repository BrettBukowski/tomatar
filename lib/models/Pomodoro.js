'use strict';

var db = require('../database'),
    Q = require('q'),
    PomClient, UserPomClient;

db.orm.table('pomodori')
  .columns(['id', 'notes', 'date', 'time', 'duration'])
  .join('user_pomodori_sessions').oneToOne('user_pomodori_sessions').on({ id: 'pomodori_id' });
db.orm.table('user_pomodori_sessions')
  .columns(['user_id', 'pomodori_id'])
  .join('users').oneToOne('users').on({ user_id: 'id' })
  .join('pomodori').oneToOne('pomodori').on({ pomodori_id: 'id' });

PomClient = db.createClient('pomodori');
UserPomClient = db.createClient('user_pomodori_sessions');

function guardUserAssociation (user) {
  if (!user || !user.id) return Q.fcall(function () { throw "Invalid user supplied"; });
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

  return PomClient.create({ data: pomodoro }).then(function (result) {
    pomodoro.id = result.id;

    return UserPomClient.create({ data: { user_id: pomodoro.user.id, pomodori_id: pomodoro.id  } }).then(function () {
      return pomodoro;
    });
  });
};

Pomodoro.update = function (pomodoro) {
  return PomClient.update({ criteria: { id: pomodoro.id }, data: pomodoro }).then(function () {
    return pomodoro;
  });
};

Pomodoro.destroy = function (pomodoro) {
  return PomClient.remove(pomodoro.id);
};

Pomodoro.getInDateRangeForUser = function (range, user) {

};
Pomodoro.getAllForUser = function (user) {

};
