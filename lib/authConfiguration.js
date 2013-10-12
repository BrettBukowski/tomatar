"use strict";

var authKeys = require('../config/auth'),
    User = require('./models/User'),
    passport = require('flatiron-passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    GitHubStrategy = require('passport-github').Strategy;

function findOrCreateUser (profile, done) {
  return User.findOrCreate(profile).then(function (user) {
    done(null, user);
  }, done);
}

// profile:
// - id {string}
// - provider {string}
// - emails {array}
// - displayName {string}
function incomingAuthCallback (token, tokenSecret, profile, done) {
  return findOrCreateUser(profile, done);
}

function incomingGoogleAuthCallback (identifier, profile, done) {
  profile.id = identifier;
  profile.provider = 'google';
  return incomingAuthCallback(null, null, profile, done);
}

var Config = {};

Config.strategies = ['facebook', 'google', 'github'];

Config.strategyOptions = {
  facebook: { scope: 'email' }
};

Config.configure = function (hostname) {
  this.hostname = hostname;
  this.facebook();
  this.google();
  this.github();
  this.passportSession();
};

Config.strategyRoutes = function (defaultRouteHandler) {
  var routes = {},
      request = function (strategy) { return passport.authenticate(strategy, Config.strategyOptions[strategy]); },
      response = function (strategy) {
        return passport.authenticate(strategy, {
          failureRedirect: '/'
        });
      };

  this.strategies.forEach(function (strategy) {
    routes['/auth/' + strategy] = request(strategy);
    routes['/auth/' + strategy + '/callback'] = [response(strategy), defaultRouteHandler];
  });

  return routes;
};

Config.facebook = function () {
  passport.use(new FacebookStrategy({
      clientID:       authKeys.facebook.key,
      clientSecret:   authKeys.facebook.secret,
      callbackURL:    'http://' + this.hostname + '/auth/facebook/callback'
    }, incomingAuthCallback
  ));
};

Config.github = function () {
  passport.use(new GitHubStrategy({
      clientID:     authKeys.github.key,
      clientSecret: authKeys.github.secret,
      callbackURL: 'http://' + this.hostname + '/auth/github/callback'
    }, incomingAuthCallback
  ));
};

Config.google = function () {
  passport.use(new GoogleStrategy({
      returnURL:  'http://' + this.hostname + '/auth/google/callback',
      realm:      'http://' + this.hostname + '/'
    }, incomingGoogleAuthCallback
  ));
};

Config.passportSession = function () {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id).then(function (user) {
      done(null, user);
    }, done);
  });
};

module.exports = Config;
