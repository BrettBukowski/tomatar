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

var routes = authConfiguration.strategyRoutes(function (err, user) {
  (new Cookies(this.req, this.res)).set('signin', 'true', {
    httpOnly: false,
    expires: new Date(new Date().getTime() + cookieSettings.maxAge)
  });

  this.res.redirect('/');
}), route;
for (route in routes) {
  app.router.get(route, routes[route]);
}

app.router.get('/status', function () {
  this.res.writeHead(200, { 'Content-Type': 'application/json' });
  this.res.write(JSON.stringify({ signedIn: this.req.isAuthenticated(), user: this.req.user }));
  this.res.end();
});

app.router.post('/signout', function () {
  this.req.logOut();

  (new Cookies(this.req, this.res)).set('signin');

  this.res.writeHead(200, { 'Content-Type': 'application/json' });
  this.res.write(JSON.stringify({ success: true }));
  this.res.end();
});

app.start(5000);
