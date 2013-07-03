'use strict';

// var User = require('./models/User');
var utils = require('../utils');


function ensureUserSession (next) {
  if (this.req.isAuthenticated()) return next();

  utils.writeJSON(this.res, "User isn't signed in", 403);
  return false;
}

function saveUserPrefs () {
  var res = this.res;
  this.req.user.savePrefs(this.req.body.prefs).then(function () {
    utils.writeJSON(res);
  }, function (err) {
    utils.writeJSON(res, err, 400);
  });
}

function getPomodoroHistory () {
  utils.writeJSON(this.res, {
    'bananas': true
  });
}

function getStatus () {
  utils.writeJSON(this.res, {
    signedIn: this.req.isAuthenticated(),
    user: this.req.user
  });
}

module.exports = {
  '/status': { get: getStatus },
  '/user': {
    '/prefs': { post: [ ensureUserSession, saveUserPrefs ] },
    '/pomodoro':  { get: [ ensureUserSession, getPomodoroHistory ] },
  }
};
