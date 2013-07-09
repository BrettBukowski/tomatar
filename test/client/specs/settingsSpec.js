/* global describe,it,expect,inject,beforeEach,define,jasmine,spyOn */
'use strict';

define(['services/Settings'], function () {
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

  describe('Settings Service', function() {

    beforeEach(module('tomatar'));

    describe('#get uses local storage', function() {
      beforeEach(module(function ($provide) {
        storageService = { getJSON: function(){} };
        spyOn(storageService, 'getJSON').andReturn({ bananas: true});
        userService = jasmine.createSpyObj('userService', ['signedIn', 'savePrefs', 'getPrefs']);
        provideServices($provide);
      }));

      it('Returns a promise', inject(function (settingsService) {
        expect(typeof settingsService.get().then).toEqual('function');
      }));

      it('Prefers localStorage', inject(function ($rootScope, settingsService) {
        var actual;
        settingsService.get().then(function (result) {
          actual = result;
        });
        $rootScope.$apply();

        expect(storageService.getJSON).toHaveBeenCalled();
        expect(userService.signedIn).not.toHaveBeenCalled();
        expect(actual.bananas).toEqual(true);
        expect(actual.breaks).toBeDefined();
      }));
    });

    describe('#get makes a remote call', function () {
      beforeEach(module(function ($provide) {
        storageService = { getJSON: function(){} };
        userService = {
          signedIn: function () { return true; },
          getPrefs: function() { return { then: function() {} };}
        };
        spyOn(userService, 'getPrefs').andCallThrough();
        provideServices($provide);
      }));

      it('Falls back to GET localStorage is empty and user is logged in', inject(function (settingsService) {
        settingsService.get();
        expect(userService.getPrefs).toHaveBeenCalled();
      }));
    });

    describe('#get returns default values for non-logged-in users', function () {
      beforeEach(module(function ($provide) {
        storageService = { getJSON: function(){} };
        userService = { signedIn: function (){} };
        provideServices($provide);
      }));

      it('Returns default values if localStorage is empty and user is not logged in', inject(function ($rootScope, settingsService) {
        var actual;
        settingsService.get().then(function (result) {
          actual = result;
        });
        $rootScope.$apply();

        expect(actual.breaks).toBeDefined();
        expect(actual.alarms).toBeDefined();
        expect(actual.ui).toBeDefined();
      }));
    });

    describe('#get returns default values for logged-in users w/o any saved prefs', function () {
      beforeEach(module(function ($provide) {
        storageService = { getJSON: function(){}, setJSON: function(){} };
        userService = {
          signedIn: function () { return true; },
          getPrefs: function () { return { then: function (cb) { cb(); }}; }
        };
        provideServices($provide);
      }));

      it('Returns default values if localStorage is empty and GET response is empty', inject(function ($rootScope, settingsService) {
        var actual;
        settingsService.get().then(function (result) {
          actual = result;
        });
        $rootScope.$apply();

        expect(actual.breaks).toBeDefined();
        expect(actual.alarms).toBeDefined();
        expect(actual.ui).toBeDefined();
      }));
    });

    describe('#set behavior', function () {
      beforeEach(module(function ($provide) {
        storageService = jasmine.createSpyObj('storageService', ['setJSON']);
        userService = jasmine.createSpyObj('userService', ['signedIn', 'savePrefs']);
        provideServices($provide);
      }));

      it('Saves to localStorage', inject(function (settingsService) {
        settingsService.save({ bananas: true });
        expect(storageService.setJSON).toHaveBeenCalledWith('settings', { bananas: true });
      }));

      it('Does not save to remote storage if user is not logged in', inject(function (settingsService) {
        settingsService.save({ bananas: true });
        expect(userService.savePrefs).not.toHaveBeenCalled();
      }));

      it('Fires an event', inject(function ($rootScope, settingsService) {
        var fired = false,
            actual;
        $rootScope.$on('settingsSaved', function (evt, result) {
          fired = true;
          actual = result;
        });
        settingsService.save({ bananas: true });
        expect(fired).toEqual(true);
        expect(actual).toEqual({ bananas: true });
      }));
    });

    describe('#set behavior when logged in', function () {
      beforeEach(module(function ($provide) {
        storageService = jasmine.createSpyObj('storageService', ['setJSON']);
        userService = {
          signedIn: function () { return true; },
          savePrefs: function () {}
        };
        spyOn(userService, 'savePrefs');
        provideServices($provide);
      }));

      it('Saves to remote storage if user is logged in', inject(function (settingsService) {
        settingsService.save({ bananas: true, alarms: { sounds: { available: [] }}});
        expect(userService.savePrefs).toHaveBeenCalledWith({ bananas: true, alarms: { sounds: {}}});
      }));
    });

  });
});
