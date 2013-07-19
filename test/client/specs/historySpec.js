/* global describe,it,expect,inject,beforeEach,define,jasmine,spyOn */
'use strict';

define(['services/History'], function () {
  var storageService,
      userService;

  function provideServices ($provide) {
    $provide.provider('storageService', function () {
      this.$get = function () { return storageService; };
    });

    $provide.provider('userService', function () {
      this.$get = function () { return userService; };
    });
  }

  describe('History Service', function() {

    beforeEach(module('tomatar'));

    describe('#saveToToday - local storage', function () {
      beforeEach(module(function ($provide) {
        storageService = { setJSON: function(){}, getJSON: function(){} };
        spyOn(storageService, 'setJSON');

        userService = {
          savePomodoro: function(){}
        };
        spyOn(userService, 'savePomodoro').andCallFake(function () {
          return { then: function(a, b) { b(); } };
        });

        provideServices($provide);
      }));

      it('Saves to local storage', inject(function (historyService) {
        var now = new Date(),
            expected = [{
              bananas: true
            }];

        historyService.saveToToday(expected[0]);
        expect(storageService.setJSON).toHaveBeenCalledWith('local', expected);
      }));

      it('Fires an event', inject(function ($rootScope, historyService) {
        var called;
        $rootScope.$on('historySaved', function () {
          called = true;
        });
        historyService.saveToToday({ bananas: true });
        expect(called).toBe(true);
      }));
    });

    describe('#saveToToday - remote storage', function () {
      beforeEach(module(function ($provide) {
        storageService = { setJSON: function(){}, getJSON: function(){} };
        spyOn(storageService, 'setJSON');

        userService = {
          signedIn: function () { return true; },
          savePomodoro: function () {}
        };
        spyOn(userService, 'savePomodoro').andCallFake(function () {
          return { then: function(a, b) { a({ id: 'yes' }); } };
        });

        provideServices($provide);
      }));

      it('Saves to remote', inject(function (historyService) {
        var now = new Date(),
            input = {
              bananas: true
            };

        historyService.saveToToday(input);
        expect(userService.savePomodoro).toHaveBeenCalledWith(input);
        expect(storageService.setJSON).toHaveBeenCalledWith('synced', [{ id: 'yes' }]);

      }));
    });

  });
});
