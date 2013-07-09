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
        userService = jasmine.createSpyObj('userService', ['signedIn', 'savePrefs', 'getPrefs']);
        provideServices($provide);
      }));

      it('Saves to local storage', inject(function (historyService) {
        var now = new Date(),
            expected = {};
        expected[now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()] = [
          { bananas: true, finished: now.getHours() + ':' + now.getMinutes() }
        ];

        historyService.saveToToday({ bananas: true });
        expect(storageService.setJSON).toHaveBeenCalledWith('history', expected);
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
        userService = {
          signedIn: function () { return true; },
          savePomodoro: function () {}
        };
        spyOn(userService, 'savePomodoro');
        provideServices($provide);
      }));

      it('Saves to remote', inject(function (historyService) {
        var now = new Date();

        historyService.saveToToday({ bananas: true });
        expect(userService.savePomodoro).toHaveBeenCalledWith({
          bananas: true,
          finished: now.getHours() + ':' + now.getMinutes(),
          date: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
        });
      }));
    });

  });
});
