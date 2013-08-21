"use strict";

var db = require('../database'),
    UserClient, UserStrategyClient;

db.orm.table('users')
   .columns(['id', 'name', 'email', 'preferences'])
   .join('user_auth_strategies').oneToMany('user_auth_strategies').on({ id: 'user_id' });
db.orm.table('user_auth_strategies')
   .columns(['user_id', 'service', 'service_user_id'])
   .join('users').oneToOne('users').on({ user_id: 'id' });

UserClient = db.createClient('users');
UserStrategyClient = db.createClient('user_auth_strategies');

module.exports = User;

function findByStrategy (user) {
  return UserStrategyClient.findOne({
    criteria: {
      service:          user.service,
      service_user_id:  user.service_user_id
    },
    joins: [ 'users' ]
  });
}

function userFromQuery (queryResult) {
  if (!queryResult) return queryResult;

  var newUser = new User();
  newUser.set(queryResult);

  return newUser;
}

// User db columns → Passport User Profile properties
// <http://passportjs.org/guide/profile/>
var passportMapping = {
  'service':          'provider',
  'service_user_id':  'id',
  'name':             'displayName',
  'email':            function (profile) { return profile.emails ? profile.emails[0].value : null; }
};

/**
 * @constructor
 * @param {Object=} profile Profile properties
 */
function User (profile) {
  if (profile) {
    var prop, profileProp;
    for (prop in passportMapping) {
      profileProp = passportMapping[prop];
      this[prop] = (typeof profileProp === 'function') ? profileProp(profile) : profile[profileProp];
    }
  }
}

/**
 * Set properties on the user instance.
 * @param  {String|Object} name property name or object literal
 *                              containing properties to set
 * @param  {String=} val  Property value or unspecified if passing
 *                        an object literal for name
 */
User.prototype.set = function (name, val) {
  if (typeof name == 'string' && val !== undefined) {
    this[name] = val;
  }
  else if (name && val === undefined) {
    for (var prop in name) {
      this[prop] = name[prop];
    }
  }
};

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

  return UserStrategyClient.create({
    data: {
      user_id:          this.id,
      service:          this.service,
      service_user_id:  this.service_user_id
    }
  });
};

User.prototype.destroy = function () {
  if (!this.id) throw new Error("Attempting to destroy an unsaved user");

  return UserClient.remove(this.id);
};

User.findOrCreate = function (profile) {
  var user = new User(profile);

  return findByStrategy(user).then(function (existingUserInfo) {
    if (existingUserInfo) {
      user.set(existingUserInfo);
      return user;
    }

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
  return UserClient.create({ data: newUser }).then(function (result) {
    newUser.id = result.id;

    return newUser.saveStrategy().then(function () {
      return newUser;
    });
  });
};

User.update = function (user) {
  return UserClient.update({ criteria: { id: user.id }, data: user }).then(function () {
    return user;
  });
};

User.findById = function (id) {
  return UserClient.findById(id).then(userFromQuery);
};

User.findBy = function (criteria) {
  return UserClient.findOne({ criteria: criteria }).then(userFromQuery);
};
