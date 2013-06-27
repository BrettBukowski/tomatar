"use strict";

var Q = require('q'),
    pg = require('pg'),
    orm = require('thin-orm'),
    driver, UserClient, UserStrategyClient;

orm.table('users')
   .columns(['id', 'name', 'email'])
   .join('user_auth_strategies').oneToMany('user_auth_strategies').on({ id: 'user_id' });
orm.table('user_auth_strategies')
   .columns(['user_id', 'service', 'service_user_id'])
   .join('users').oneToOne('users').on({ user_id: 'id' });

driver = orm.createDriver('pg', { pg: pg, connect: 'tcp://brettbukowski:5432@localhost/tomatar-dev' });
UserClient = orm.createClient(driver, 'users');
UserStrategyClient = orm.createClient(driver, 'user_auth_strategies');

module.exports = User;

function findByStrategy (user) {
  var find = Q.nbind(UserStrategyClient.findOne, UserStrategyClient);

  return find({
    criteria: {
      service:          user.service,
      service_user_id:  user.service_user_id
    },
    joins: [ 'users' ]
  });
}

// User db columns → Passport User Profile properties
// <http://passportjs.org/guide/profile/>
var passportMapping = {
  'service':          'provider',
  'service_user_id':  'id',
  'name':             'displayName',
  'email':            'email'
};

/**
 * @constructor
 * @param {Object=} profile Profile properties
 */
function User (profile) {
  if (profile) {
    for (var prop in passportMapping) {
      this[prop] = profile[passportMapping[prop]];
    }
  }
}

User.prototype.save = function () {
  if (this.id) return User.update(this);

  return User.create(this);
};

/**
 * A user may have > 1 auth strategies.
 * But she's never logged in thru > 1
 * at one time. So rather than keep track
 * of the various auth strategies a user
 * may have, a single user instance only
 * cares about a single auth strategy at
 * one time.
 */
User.prototype.saveStrategy = function () {
  if (!this.id || !this.service || !this.service_user_id) {
    throw new Error("Attempting to save a strategy with insufficient data");
  }

  var createUserStrategy = Q.nbind(UserStrategyClient.create, UserStrategyClient);

  return createUserStrategy({
    data: {
      user_id:          this.id,
      service:          this.service,
      service_user_id:  this.service_user_id
    }
  });
};

User.findOrCreate = function (profile) {
  var user = new User(profile);

  return findByStrategy(user).then(function (existingUserInfo) {
    if (existingUserInfo) return new User(existingUserInfo);

    if (user.email) {
      return User.findBy({ email: user.email }).then(function (existingUserInfo) {
        if (existingUserInfo) {
          user.id = existingUserInfo.id;
          return user.saveStrategy();
        }

        return User.create(user);
      });
    }

    return User.create(user);
  });
};

User.create = function (newUser) {
  var createUser = Q.nbind(UserClient.create, UserClient);

  return createUser({ data: newUser }).then(function (result) {
    newUser.id = result.id;

    return newUser.saveStrategy().then(function () {
      return newUser;
    });
  });
};

User.update = function (user) {
  var updateUser = Q.nbind(UserClient.update, UserClient);

  return updateUser({ criteria: { id: user.id }, data: user }).then(function () {
    return user;
  });
};

User.destroy = function (user) {
  var remove = Q.nbind(UserClient.remove, UserClient);

  return remove(user.id);
};

User.findById = function (id) {
  var find = Q.nbind(UserClient.findById, UserClient);

  return find(id);
};

User.findBy = function (criteria) {
  var find = Q.nbind(UserClient.findOne, UserClient);

  return find({ criteria: criteria });
};
