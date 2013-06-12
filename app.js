"use strict";

var flatiron = require('flatiron'),
    ecstatic = require('ecstatic'),
    passport = require('flatiron-passport'),
    connect = require('connect'),
    RedisStore = require('connect-redis')(connect),
    authConfiguration = require('./lib/authConfiguration'),
    secrets = require('./config/auth.json'),
    app = flatiron.app;

app.config.file({ file: __dirname + 'config/config.json' });

app.use(flatiron.plugins.http, {
  before: [
    ecstatic(__dirname + '/public'),
    connect.cookieParser(secrets.cookie),
    connect.session({
      key:      'sid',
      store:    new RedisStore(),
      secret:   secrets.session,
      cookie:   { maxAge: 1000 * 60 * 60 * 24 * 365 /* one year */ }
    })
  ]
});
app.use(passport, { session: true });

authConfiguration.configure();

var routes = authConfiguration.strategyRoutes(function () {
  this.res.redirect('/');
}), route;
for (route in routes) {
  app.router.get(route, routes[route]);
}

app.start(5000);
