'use strict';

var authConfiguration = require('../lib/authConfiguration'),
    Cookies = require('cookies'),
    routes = require('./routes'),
    utils = require('./utils');


function signIn (err, user) {
  (new Cookies(this.req, this.res)).set('signin', 'true', {
    httpOnly: false,
    expires: new Date(new Date().getTime() + this.req.session.cookie.maxAge)
  });

  this.res.redirect('/#signedin');
}

function signOut () {
  if (this.req.isAuthenticated()) {
    this.req.logOut();

    (new Cookies(this.req, this.res)).set('signin');

    return utils.writeJSON(this.res);
  }

  utils.writeJSON(this.res, "User isn't signed in", 403);
}

function mountAuthRoutes (router) {
  var authRoutes = authConfiguration.strategyRoutes(signIn), route;
  for (route in authRoutes) {
    router.get(route, authRoutes[route]);
  }
}

module.exports = function (appRouter) {
  appRouter.mount(routes);
  mountAuthRoutes(appRouter);
  appRouter.post('/signout', signOut);
};
