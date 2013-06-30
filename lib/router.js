'use strict';

var authConfiguration = require('../lib/authConfiguration'),
    Cookies = require('cookies'),
    routes = require('./routes');

module.exports = function (appRouter) {
  var routes = authConfiguration.strategyRoutes(function (err, user) {
    (new Cookies(this.req, this.res)).set('signin', 'true', {
      httpOnly: false,
      // TK read expires out of session cookie rather than duplicating one yr logic
      expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365))
    });

    this.res.redirect('/');
  }), route;
  for (route in routes) {
    console.log(route);
    appRouter.get(route, routes[route]);
  }

  appRouter.get('/status', function () {
    this.res.writeHead(200, { 'Content-Type': 'application/json' });
    this.res.write(JSON.stringify({ signedIn: this.req.isAuthenticated(), user: this.req.user }));
    this.res.end();
  });

  function writeJSON (type, content) {
    this.writeHead(type == 'success' ? 200 : type, {
      'Content-Type': 'application/json'
    });

    if (!content) content = {};
    else if (typeof content == 'string') content = { error: content };
    content.success = type == 'sucess';

    this.write(JSON.stringify(content));
    this.end();
  }

  appRouter.post('/signout', function () {
    this.req.logOut();

    (new Cookies(this.req, this.res)).set('signin');

    writeJSON.call(this.res, 'success');
  });

  // appRouter.mount(routes);
};
