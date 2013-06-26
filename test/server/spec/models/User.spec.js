'use strict';

var expect = require('chai').expect,
    User = require('../../../../lib/models/User');

describe('User', function () {
  var user;
  var props = {
    id:           '15212343229991231000',
    provider:     'github',
    displayName:  'a b',
    email:        (+new Date()) + '.sit.down@human.ice'
  };

  describe('Constructor', function () {
    it('assigns renamed supplied properties', function () {

      user = new User(props);

      expect(user.service_user_id).to.equal(props.id);
      expect(user.service).to.equal(props.provider);
      expect(user.name).to.equal(props.displayName);
      expect(user.email).to.equal(props.email);
    });

    it('ignores other properties', function () {
      user = new User({ bananas: true });

      expect(user.bananas).to.be.undefined;
    });
  });

  describe('#create()', function () {
    it('saves a new user', function (done) {
      user = new User(props);

      User.create(user).done(function (newUser) {

        expect(newUser).not.to.be.undefined;
        expect(newUser.id).not.to.be.null;

        done();
      });
    });
  });

  describe('#saveStrategy()', function () {
    it('Throws an error on an unsaved user', function () {
      expect(function () { new User().saveStrategy(); }).to.throw();
    });
  });

  describe('findOrCreate', function () {

  });

  describe('update', function () {

  });


  describe('#findById()', function () {
    it('Finds existing users', function () {

    });

    it("Doesn't find non-existing users", function (done) {
      User.findById(234110234).done(function (result) {
        expect(result).to.be.undefined;
        done();
      });
    });

    it('Errors on invalid input', function (done) {
      User.findById('bananas').fail(function (error) {
        expect(error).not.to.be.undefined;
        done();
      });
    });
  });

  describe('#findBy()', function () {
    it('Finds by given criteria without error', function (done) {
      User.findBy({ email: 'blah@bleck.me' }).done(function (result) {
        done();
      });
    });

    it('Errors on invalid criteria', function (done) {
      User.findBy({ bananas: 'fellowship' }).fail(function (error) {
        expect(error).not.to.be.undefined;
        done();
      });
    });
  });

  describe('#destroy()', function () {
    it('Removes the given user', function (done) {
      User.destroy(user).done(function () {
        done();
      });
    });

    it('Errors for invalid user', function (done) {
      User.destroy({ id: (+ new Date()) }).fail(function (error) {
        expect(error).not.to.be.undefined;
        done();
      });
    });
  });
});
