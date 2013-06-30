"use strict";

var flatiron = require('flatiron'),
    ecstatic = require('ecstatic'),
    passport = require('flatiron-passport'),
    connect = require('connect'),
    RedisStore = require('connect-redis')(connect),
    authConfiguration = require('./lib/authConfiguration'),
    router = require('./lib/router'),
    secrets = require('./config/auth.json'),
    app = flatiron.app,
    cookieSettings = { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 /* one year */ };

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
router(app.router);

app.start(5000);
