"use strict";

var authKeys = require('../config/auth'),
    User = require('./models/User'),
    passport = require('flatiron-passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    GitHubStrategy = require('passport-github').Strategy;

function findOrCreateUser (profile, done) {
  User.findOrCreate(profile, function (err, user) {
    done(err, user);
  });
}

function userInfoCallback (strategy) {
  if (strategy == 'google') {
    return function (identifier, profile, done) {
      profile.id = identifier;
      profile.provider = 'google';
      findOrCreateUser(profile, done);
    };
  }

  return function (token, tokenSecret, profile, done) {
    findOrCreateUser(profile, done);
  };
}


var Config = {};

Config.strategies = ['twitter', 'google', 'github'];

Config.configure = function () {
  this.twitter();
  this.google();
  this.github();
  this.passportSession();
};

Config.strategyRoutes = function (defaultRouteHandler) {
  var routes = {},
      request = function (strategy) { return passport.authenticate(strategy); },
      response = function (strategy) {
        return passport.authenticate(strategy, {
          successRedirect: '/',
          failureRedirect: '/'
        });
      };

  this.strategies.forEach(function (strategy) {
    routes['/auth/' + strategy] = request(strategy);
    routes['/auth/' + strategy + '/callback'] = [response(strategy), defaultRouteHandler];
  });

  return routes;
};

Config.twitter = function () {
  passport.use(new TwitterStrategy({
      consumerKey:    authKeys.twitter.key,
      consumerSecret: authKeys.twitter.secret,
      callbackURL:    'http://0.0.0.0:5000/auth/twitter/callback'
    }, userInfoCallback('twitter')
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
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

module.exports = Config;
