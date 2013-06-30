'use strict';

// var User = require('./models/User');

function ensureUserSession () {
  if (this.req.isAuthenticated()) return this.res.emit('next');

  this.res.writeHead(403, { 'Content-Type': 'application/json' });
  this.res.end(JSON.stringify({ error: "User isn't signed in" }));
}

function saveUserPrefs () {
  this.req.user.savePrefs(this.req.body.prefs).then(function () {
    writeJSON.call(res, 'success');
  }, function (err) {
    writeJSON.call(res, 400, err);
  });
}

function getPomodoroHistory () {

}

module.exports = {
  '/user': {
    '/prefs': { post: [ ensureUserSession, saveUserPrefs ] },
    '/pomodoro': { get: [ ensureUserSession, getPomodoroHistory ] },
  }
};
