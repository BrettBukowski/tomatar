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

function userInfoCallback (strategy) {
  if (strategy == 'google') {
    return function (identifier, profile, done) {
      profile.id = identifier;
      profile.provider = strategy;

      return findOrCreateUser(profile, done);
    };
  }

  return function (token, tokenSecret, profile, done) {
    return findOrCreateUser(profile, done);
  };
}


var Config = {};

Config.strategies = ['facebook', 'google', 'github'];

Config.strategyOptions = {
  facebook: { scope: 'email' }
};

Config.configure = function () {
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
      callbackURL:    'http://0.0.0.0:5000/auth/facebook/callback'
    }, userInfoCallback('facebook')
  ));
};

Config.github = function () {
  passport.use(new GitHubStrategy({
      clientID:     authKeys.github.key,
      clientSecret: authKeys.github.secret,
      callbackURL: 'http://0.0.0.0:5000/auth/github/callback'
    }, userInfoCallback('github')
  ));
};

Config.google = function () {
  passport.use(new GoogleStrategy({
      returnURL:  'http://0.0.0.0:5000/auth/google/callback',
      realm:      'http://0.0.0.0:5000/'
    }, userInfoCallback('google')
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
