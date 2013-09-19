'use strict';

var Q = require('q'),
    orm = require('thin-orm'),
    pg = require('pg'),
    config = require('../config/' + (process.env.NODE_ENV || 'development')).database,
    driver = orm.createDriver('pg', {
      pg: pg,
      connect: 'tcp://' + config.user + ':' + config.port + '@' + config.host + '/' + config.db
    });

var methodsToWrap = ['query', 'findMany', 'findById', 'findOne', 'create', 'update', 'remove'];

function promiseize (crudClient) {
  var wrapper = {};

  methodsToWrap.forEach(function (method) {
    wrapper[method] = Q.nbind(crudClient[method], crudClient);
  });

  return wrapper;
}

module.exports = {
  orm:          orm,
  createClient: function (table) {
    return promiseize(orm.createClient(driver, table));
  }
};
