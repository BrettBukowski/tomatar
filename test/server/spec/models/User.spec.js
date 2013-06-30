'use strict';

var expect = require('chai').expect,
    User = require('../../../../lib/models/User');

describe('User', function () {
  var user;
  var props = {
    id:           '15212343229991231000',
    provider:     'github',
    displayName:  'a b',
    emails:       [{ value: (+new Date()) + '.sit.down@human.ice' }]
  };

  describe('Constructor', function () {
    it('assigns renamed supplied properties', function () {

      user = new User(props);

      expect(user.service_user_id).to.equal(props.id);
      expect(user.service).to.equal(props.provider);
      expect(user.name).to.equal(props.displayName);
      expect(user.email).to.equal(props.emails[0].value);
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

    it('Errors on invalid input', function (done) {
      User.create({ bananas: true }).fail(function (error) {
        expect(error).not.to.be.undefined;
        done();
      });
    });
  });

  describe('#saveStrategy()', function () {
    it('Errors on an unsaved user', function () {
      expect(function () { new User().saveStrategy(); }).to.throw();
    });
  });

  describe('#findOrCreate()', function () {
    it('Finds an existing user', function (done) {
      User.findOrCreate(props).done(function (found) {
        expect(found.id).not.to.be.null;
        done();
      });
    });

    it('Errors on invalid input', function (done) {
      User.findOrCreate({ bananas: true }).fail(function (error) {
        expect(error).not.to.be.undefined;
        done();
      });
    });
  });

  describe('#update()', function () {
    it('Updates an existing user', function (done) {
      user.name = 'bananas';
      User.update(user).done(function (result) {
        expect(result.name).to.equal(user.name);
        done();
      });
    });

    it('Errors on new user', function (done) {
      var newUser = new User({});
      User.update(newUser).fail(function (error) {
        expect(error).not.to.be.undefined;
        done();
      });
    });
  });

  describe('#set()', function () {
    it('Sets a prop w/ name, val', function () {
      var a = new User();
      a.set('bananas', 'hey');
      expect(a.bananas).to.equal('hey');
    });

    it('Sets multiple props w/ an object literal', function () {
      var a = new User();
      a.set({ bananas: true, concrete: 'no' });
      expect(a.bananas).to.be.true;
      expect(a.concrete).to.equal('no');
    });
  });

  describe('#save()', function () {
    it('Updates an existing user', function (done) {
      user.name = 'heeey';
      user.save().done(function (result) {
        expect(result.name).to.equal(user.name);
        done();
      });
    });

    it('Creates a new user', function (done) {
      var newUser = new User({
        provider:     'google',
        id:           '2323491234a234',
        displayName:  'time like',
        emails:       [{ value: 'df@fb.me' }]
      });
      newUser.save().done(function (result) {
        expect(result.id).not.to.be.undefined;
        User.destroy(newUser);
        done();
      });
    });
  });

  describe('#findById()', function () {
    it('Finds existing users', function (done) {
      User.findById(user.id).done(function (result) {
        expect(result.id).to.equal(user.id);
        done();
      });
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
        expect(result).to.be.undefined;
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
