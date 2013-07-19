'use strict';

var User = require('../models/User'),
    Pomodoro = require('../models/Pomodoro'),
    utils = require('../utils'),
    Q = require('q');


module.exports = {
  '/user': {
    '/prefs': {
      get: [ ensureUserSession, getUserPrefs ],
      post: [ ensureUserSession, saveUserPrefs ]
    },
    '/pomodoro':  {
      get: [ ensureUserSession, getAllPomodoroHistory ],
      post: [ ensureUserSession, savePomodoro ],
      '/sync': {
        post: [ ensureUserSession, syncPomodori ]
      },
      '/month': {
        '/:interval': {
          get: [ ensureUserSession, getPomodoroHistoryForMonth ]
        }
      },
      '/between': {
        '/:date1/:date2': {
          get: [ ensureUserSession, getPomodoroHistoryForRange ]
        }
      }
    }
  }
};

function ensureUserSession () {
  // `next()` is usually the first param, unless the route
  // is capturing params, where ea. captured param appears
  // as the prior arguments...
  var args = Array.prototype.slice.call(arguments),
      next = args.pop();

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

function getAllPomodoroHistory () {
  var res = this.res;

  Pomodoro.getAllForUser(this.req.user).then(function (result) {
    utils.writeJSON(res, result);
  }, function (err) {
    utils.writeJSON(res, err, 400);
  });
}

function getPomodoroHistory (req, res, interval) {
  Pomodoro.getInDateRangeForUser(interval, req.user).then(function (result) {
    utils.writeJSON(res, result);
  }, function (err) {
    utils.writeJSON(res, err, 400);
  });
}

/**
 * @param  {string} yearAndMonth YYYY-MM OR YYYY-M
 */
function getPomodoroHistoryForMonth (yearAndMonth) {
  getPomodoroHistory(this.req, this.res, { start: yearAndMonth });
}

/**
 * date1 must be less than date2.
 * @param  {string} date1 YYYY-MM OR YYYY-M (inclusive)
 * @param  {string} date2 YYYY-MM OR YYYY-M (exclusive)
 */
function getPomodoroHistoryForRange (date1, date2) {
  getPomodoroHistory(this.req, this.res, {
    start: date1,
    end:   date2
  });
}

function savePomodoro () {
  var req = this.req,
      res = this.res,
      session = new Pomodoro({
        notes:    req.body.notes || null,
        duration: req.body.duration,
        date:     req.body.date,
        time:     req.body.time
      });

  session.save(this.req.user).then(function (saved) {
    utils.writeJSON(res, saved);
  }, function (err) {
    utils.writeJSON(res, err, 400);
  });
}

function syncPomodori () {
  var req = this.req,
      res = this.res,
      promises = [];

  req.body.pomodori.forEach(function (pomodoro) {
    promises.push(Pomodoro.findOneForUser({}, req.user).then(function (found) {
      if (!found) {
        return new Pomodoro({
          notes:    pomodoro.notes || null,
          duration: pomodoro.duration,
          date:     pomodoro.date,
          time:     pomodoro.time
        }).save(req.user);
      }
    }));
  });

  Q.all(promises).then(function (results) {
    utils.writeJSON(res, results);
  }, function (err) {
    utils.writeJSON(res, err, 400);
  });
}
