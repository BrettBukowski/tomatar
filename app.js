"use strict";

var flatiron = require('flatiron'),
    ecstatic = require('ecstatic'),
    passport = require('flatiron-passport'),
    connect = require('connect'),
    RedisStore = require('connect-redis')(connect),
    authConfiguration = require('./lib/authConfiguration'),
    router = require('./lib/router'),
    secrets = require('./config/auth.json'),
    configuration = require('./config/' + (process.env.NODE_ENV || 'development')),
    app = flatiron.app;

app.config.file({ file: __dirname + 'config/config.json' });

app.use(flatiron.plugins.http, {
  before: [
    connect.cookieParser(secrets.cookie),
    connect.session({
      key:      'session',
      store:    new RedisStore(),
      secret:   secrets.session,
      cookie:   {
        httpOnly: true,
        maxAge:   1000 * 60 * 60 * 24 * 365 /* one year */
      }
    }),
    ecstatic(__dirname + '/public')
  ]
});
app.use(passport, { session: true });
authConfiguration.configure(configuration.hostname);
router(app.router);

app.start(5000);
