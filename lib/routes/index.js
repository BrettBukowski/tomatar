'use strict';

var User = require('../models/User'),
    Pomodoro = require('../models/Pomodoro'),
    utils = require('../utils');


module.exports = {
  '/status': { get: getStatus },
  '/user': {
    '/prefs': {
      get: [ ensureUserSession, getUserPrefs ],
      post: [ ensureUserSession, saveUserPrefs ]
    },
    '/pomodoro':  {
      get: [ ensureUserSession, getPomodoroHistory ],
      post: [ ensureUserSession, savePomodoro ]
    }
  }
};

function ensureUserSession (next) {
  if (this.req.isAuthenticated()) return next();

  utils.writeJSON(this.res, "User isn't signed in", 403);
  return false;
}

function saveUserPrefs () {
  var res = this.res,
      user = this.req.user;

  user.set('preferences', this.req.body.prefs);
  user.save().then(function () {
    utils.writeJSON(res);
  }, function (err) {
    utils.writeJSON(res, err, 400);
  });
}

function getUserPrefs () {
  var res = this.res;

  User.findById(this.req.user.id).then(function (result) {
    utils.writeJSON(res, result.preferences);
  }, function (err) {
    utils.writeJSON(res, err, 400);
  });
}

function getPomodoroHistory () {
  utils.writeJSON(this.res, {
    'bananas': true
  });
}

function savePomodoro () {
  var req = this.req,
      res = this.res,
      session = new Pomodoro({
        notes:    req.body.notes || null,
        duration: req.body.duration,
        date:     req.body.date,
        time:     req.body.finished
      });

  session.save(this.req.user).then(function () {
    utils.writeJSON(res);
  }, function (err) {
    utils.writeJSON(err, 400);
  });
}

function getStatus () {
  utils.writeJSON(this.res, {
    signedIn: this.req.isAuthenticated(),
    user: this.req.user
  });
}
