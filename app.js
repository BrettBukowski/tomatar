"use strict";

var flatiron = require('flatiron'),
    ecstatic = require('ecstatic'),
    passport = require('flatiron-passport'),
    connect = require('connect'),
    RedisStore = require('connect-redis')(connect),
    authConfiguration = require('./lib/authConfiguration'),
    secrets = require('./config/auth.json'),
    app = flatiron.app,
    Cookies = require('cookies'),
    cookieSettings = { maxAge: 1000 * 60 * 60 * 24 * 365 /* one year */ };

app.config.file({ file: __dirname + 'config/config.json' });

app.use(flatiron.plugins.http, {
  before: [
    connect.cookieParser(secrets.cookie),
    connect.session({
      key:      'session',
      store:    new RedisStore(),
      secret:   secrets.session,
      cookie:   cookieSettings
    }),
    ecstatic(__dirname + '/public')
  ]
});
app.use(passport, { session: true });

authConfiguration.configure();

var routes = authConfiguration.strategyRoutes(function () {
  var cookies = new Cookies(this.req, this.res),
      options = {
        httpOnly: false,
        expires: new Date(new Date().getTime() + cookieSettings.maxAge)
      };

  cookies.set('signin', 'true', options);

  this.res.redirect('/');
}), route;
for (route in routes) {
  app.router.get(route, routes[route]);
}

app.start(5000);
