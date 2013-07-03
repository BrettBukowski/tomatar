'use strict';

var expect = require('chai').expect,
    User = require('../../../../lib/models/User'),
    Pomodoro = require('../../../../lib/models/Pomodoro');

describe('Pomodoro', function () {
  var pom,
      user,
      props = {
        notes: 'bananas',
        date: '7/2/13',
        time: '7:11 PM',
        duration: 25
    };

  before(function (done) {
    new User({
      provider: 'google',
      id: 'blah',
      displayName: 'first last',
      emails: [ { value: 'blast@boom.bam' }]
    }).save().done(function (newUser) {
      user = newUser;
      done();
    });
  });

  after(function () {
    User.destroy(user);
  });

  describe('Constructor', function () {
    it('Populates object instance with properties', function () {
      var session = new Pomodoro({ notes: 'bananas', solid: true });
      expect(session.notes).to.equal('bananas');
      expect(session.solid).to.be.true;
    });
  });

  describe('#create()', function () {
    it('Errors if not given a valid user', function (done) {
      pom = new Pomodoro(props);
      Pomodoro.create(pom).fail(function (err) {
        expect(err).not.to.be.undefined;

        done();
      });
    });

    it('Saves a new pomodoro', function (done) {
      pom = new Pomodoro(props);
      pom.user = user;
      Pomodoro.create(pom).then(function (result) {
        expect(result).not.to.be.undefined;
        expect(result.id).not.to.be.null;

        pom = result;

        done();
      });
    });
  });

  describe('#update()', function () {
    it('Updates an existing pom', function (done) {
      pom.notes = 'more notes';
      Pomodoro.update(pom).then(function (result) {
        expect(result.notes).to.equal(pom.notes);
        done();
      });
    });

    it('Errors on new pom', function (done) {
      Pomodoro.update(new Pomodoro()).fail(function (err) {
        expect(err).not.to.be.undefined;
        done();
      });
    });
  });

  describe('#save()', function () {
    it('Errors when not given a user', function (done) {
      new User().save().fail(function (err) {
        expect(err).not.to.be.undefined;
        done();
      });
    });

    it('Creates a new pom', function (done) {
      var newOne = new Pomodoro(props);
      newOne.user = user;
      newOne.save(user).done(function (result) {
        expect(result.id).not.to.be.undefined;
        Pomodoro.destroy(result);
        done();
      });
    });

    it('Updates an existing pom', function (done) {
      pom.notes = 'notesy notesburg';
      pom.save().done(function (result) {
        expect(result.notes).to.be.equal(pom.notes);
        done();
      });
    });
  });

  describe('#getAllForUser()', function () {
    it('gets all for a valid user', function (done) {
      Pomodoro.getAllForUser(user).done(function (result) {
        expect(result.rowCount).not.to.be.undefined;
        expect(result.rows).to.be.an('array');
        done();
      });
    });

    it('Errors when not given a valid user', function (done) {
      Pomodoro.getAllForUser({ id: 'bananas' }).fail(function (err) {
        expect(err).not.to.be.undefined;
        done();
      });
    });
  });

  describe('#getInDateRangeForUser()', function () {

  });

  describe('#destroy()', function () {
    it('Errors when not given a valid object', function (done) {
      Pomodoro.destroy({ id: (+ new Date()) }).fail(function (err) {
        expect(err).not.to.be.undefined;
        done();
      });
    });

    it('Removes the given pom', function (done) {
      Pomodoro.destroy(pom).then(function () {
        done();
      });
    });
  });
});
