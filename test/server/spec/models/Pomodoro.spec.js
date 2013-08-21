'use strict';

var expect = require('chai').expect,
    User = require('../../../../lib/models/User'),
    Pomodoro = require('../../../../lib/models/Pomodoro');

describe('Pomodoro', function () {
  var pom,
      user,
      date = new Date(),
      props = {
        notes: 'bananas',
        date: (date.getMonth() + 1) + '/' + date.getDate() + '/'
          + (date.getFullYear() + '').substr(2),
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
    user.destroy();
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
        expect(result).to.be.an('array');
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

  describe('#findOneForUser()', function () {
    it('gets one for a valid user', function (done) {
      Pomodoro.findOneForUser({}, user).done(function (result) {
        expect(result).to.be.an('object');
        expect(result.user_id).to.equal(user.id);
        done();
      });
    });

    it('filters on given criteria', function (done) {
      Pomodoro.findOneForUser({ notes: pom.notes }, user).done(function (result) {
        expect(result).to.be.an('object');
        expect(result.notes).to.equal(pom.notes);
        done();
      });
    });

    it('Errors when not given a valid user', function (done) {
      Pomodoro.findOneForUser({}, { id: 'bananas' }).fail(function (err) {
        expect(err).not.to.be.undefined;
        done();
      });
    });
  });

  describe('#getInDateRangeForUser()', function () {
    it('Defaults to a month when end is not supplied', function (done) {
      var now = new Date();
      Pomodoro.getInDateRangeForUser({
        start: now.getFullYear() + '-' + (now.getMonth() + 1)
      }, user).then(function (result) {
        expect(result).to.be.an('array');
        expect(result[0].id).to.be.a('number');
        done();
      });
    });

    it('Honors the end range', function (done) {
      var now = new Date(),
          end;
      if (now.getMonth()) {
        end = now.getFullYear() + '-' + now.getMonth() + 2;
      }
      else {
        end = (now.getFullYear() - 1) + '-12';
      }

      Pomodoro.getInDateRangeForUser({
        start: now.getFullYear() + '-' + (now.getMonth() + 1),
        end:  end
      }, user).then(function (result) {
        expect(result).to.be.an('array');
        expect(result[0].id).to.be.a('number');
        done();
      });
    });

    it('Errors on invalid start date specification', function (done) {
      Pomodoro.getInDateRangeForUser({ start: 'bananas' }, user).fail(function (err) {
        expect(err).not.to.be.undefined;
        done();
      });
    });

    it('Errors on invalid end date specification', function (done) {
      Pomodoro.getInDateRangeForUser({ start: '2013-01', end: 'bananas' }, user).fail(function (err) {
        expect(err).not.to.be.undefined;
        done();
      });
    });
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
