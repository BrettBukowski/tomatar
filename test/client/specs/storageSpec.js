/* global describe,it,expect,inject,beforeEach,define,jasmine,spyOn */
'use strict';

define(['services/Storage'], function () {
  var mockWindow;

  describe('Storage Service', function() {

    beforeEach(module('tomatar'));

    describe('#get', function () {
      beforeEach(module(function ($provide) {
        $provide.value('$window', mockWindow = { localStorage: { getItem: jasmine.createSpy() } });
      }));

      it('Gets from local storage', inject(function (storageService) {
        storageService.get('bananas');
        expect(mockWindow.localStorage.getItem).toHaveBeenCalledWith('bananas');
      }));
    });

    describe('#set', function () {
      beforeEach(module(function ($provide) {
        $provide.value('$window', mockWindow = { localStorage: { setItem: jasmine.createSpy() } });
      }));

      it('Sets to local storage', inject(function (storageService) {
        storageService.set('froms', 'bananas');
        expect(mockWindow.localStorage.setItem).toHaveBeenCalledWith('froms', 'bananas');
      }));
    });

    describe('#remove', function () {
      beforeEach(module(function ($provide) {
        $provide.value('$window', mockWindow = { localStorage: { removeItem: jasmine.createSpy() } });
      }));

      it('Removes from local storage', inject(function (storageService) {
        storageService.remove('bananas');
        expect(mockWindow.localStorage.removeItem).toHaveBeenCalledWith('bananas');
      }));
    });

    describe('#setJSON', function () {
      beforeEach(module(function ($provide) {
        $provide.value('$window', mockWindow = { localStorage: { setItem: jasmine.createSpy() } });
      }));

      it('Sets json to local storage', inject(function (storageService) {
        var input = { 'bananas': 'melt' };
        storageService.setJSON('tales', input);
        expect(mockWindow.localStorage.setItem).toHaveBeenCalledWith('tales', JSON.stringify(input));
      }));
    });

    describe('#getJSON', function () {
      beforeEach(module(function ($provide) {
        $provide.value('$window', mockWindow = { localStorage: { getItem: function () {} } });
      }));

      it('Gets json from local storage', inject(function (storageService) {
        var input = { 'bananas': 'melt' };
        spyOn(mockWindow.localStorage, 'getItem').andReturn(JSON.stringify(input));
        expect(storageService.getJSON('tales')).toEqual(input);
      }));
    });
  });
});
