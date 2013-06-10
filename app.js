"use strict";

var flatiron = require('flatiron'),
    ecstatic = require('ecstatic'),
    passport = require('passport'),
    authConfiguration = require('./lib/authConfiguration'),
    path = require('path'),
    app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http, {
  before: [ ecstatic({ root: __dirname + '/public', handleError: false }) ]
});

var passportConfig = {
  successRedirect: '/',
  failureRedirect: '/'
};
authConfiguration.configure();
authConfiguration.strategies.forEach(function (strategy) {
  app.router.get('/auth/' + strategy, passport.authenticate(strategy));
  app.router.get('/auth/' + strategy + '/callback', passport.authenticate(strategy, passportConfig));
});

app.router.get('/foo', function () {
  this.res.writeHead(200, { 'Content-Type': 'text/plain' });
  this.res.end('Hello world!\n');
});

app.start(5000);
