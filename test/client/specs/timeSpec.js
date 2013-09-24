/* global describe,it,expect,inject,beforeEach,define,runs,waitsFor */
'use strict';

define(['services/TimeMaster'], function () {
  describe('Time Service', function() {
    var pomodoroService, deferred;

    beforeEach(module('tomatar'));
    beforeEach(module(function ($provide) {
      var defaultResponse = function () {
        return deferred.promise;
      };
      pomodoroService = {
        pomodoro:   defaultResponse,
        shortBreak: defaultResponse,
        longBreak:  defaultResponse
      };
      $provide.provider('pomodoroService', function () {
        this.$get = function () { return pomodoroService; };
      });
    }));

    describe('Constructor', function () {
      it('Starts at a pomodoro session with the supplied time interval', inject(function (timeService, $q, $rootScope) {
        deferred = $q.defer();
        deferred.resolve('bananas');

        var timedSession;
        runs(function () {
          timedSession = new timeService();
          $rootScope.$apply();
        });
        waitsFor(function () {
          return timedSession && timedSession.timeInterval;
        }, "timeInterval should be set", 500);
        runs(function () {
          expect(timedSession.isPomo).toBe(true);
          expect(timedSession.started).toBe(false);
          expect(timedSession.timeInterval).toBe('bananas');
        });
      }));
    });

    describe('#complete', function () {
      it('Sets up the next session', inject(function (timeService, $q, $rootScope) {
        var timedSession = new timeService();

        deferred = $q.defer();
        deferred.resolve('next');

        runs(function () {
          timedSession.complete();
          $rootScope.$apply();
        });
        waitsFor(function () {
          return timedSession && timedSession.timeInterval;
        }, "timeInterval should be set", 500);
        runs(function () {
          expect(timedSession.isPomo).toBe(false);
          expect(timedSession.started).toBe(false);
          expect(timedSession.autoStart).toBe(true);
          expect(timedSession.timeInterval).toBe('next');
        });
      }));
    });

    describe('#refresh', function () {
      it("Errors if already started", inject(function (timeService, $q, $rootScope) {
        deferred = $q.defer();
        deferred.resolve('');
        var timedSession = new timeService();
        $rootScope.$apply();

        timedSession.start();

        var errorMessage;

        runs(function () {
          timedSession.refresh().then(function () {

          }, function (err) {
            errorMessage = err;
          });
          $rootScope.$apply();
        });
        waitsFor(function () {
          return !!errorMessage;
        }, "errorMessage should be set", 500);
        runs(function () {
          expect(errorMessage).toBeTruthy();
        });
      }));

      it("Refreshes if not already started", inject(function (timeService, $q, $rootScope) {
        deferred = $q.defer();
        deferred.resolve('bananas');
        var timedSession = new timeService();
        $rootScope.$apply();

        runs(function () {
          timedSession.refresh();
          $rootScope.$apply();
        });
        waitsFor(function () {
          return !!timedSession.timeInterval;
        }, "timeInterval should be set", 500);
        runs(function () {
          expect(timedSession.isPomo).toBe(true);
          expect(timedSession.started).toBe(false);
          expect(timedSession.timeInterval).toBe('bananas');
        });
      }));
    });
  });
});
