/* global describe,it,expect,inject,beforeEach,define,jasmine,spyOn,module */
'use strict';

define(['services/Cache'], function () {
  var storageService;

  function provideServices ($provide) {
    $provide.provider('storageService', function () {
      this.$get = function () { return storageService; };
    });
  }

  function before ($provide) {
    var nope = function () {};
    storageService = {
      setJSON: nope,
      getJSON: nope,
      remove: nope
    };
    spyOn(storageService, 'setJSON');
    spyOn(storageService, 'getJSON');
    spyOn(storageService, 'remove');
    provideServices($provide);
  }

  describe('Cache Service', function() {

    beforeEach(module('tomatar'));

    describe('#set', function () {
      beforeEach(module(before));

      it('Saves JSON to storage', inject(function (cacheService) {
        cacheService.set('foo', 'bar');
        expect(storageService.setJSON).toHaveBeenCalledWith('foo', 'bar');
      }));

      it('Returns the value passed to it', inject(function (cacheService) {
        expect(cacheService.set('foo', 'bar')).toBe('bar');
      }));
    });

    describe('#setWithTTL', function () {

      beforeEach(module(before));

      it('Returns the value passed to it', inject(function (cacheService) {
        expect(cacheService.setWithTTL('foo', 'bar')).toBe('bar');
      }));

      it('Saves a timestamp for the key', inject(function (cacheService) {
        cacheService.setWithTTL('foo', 'bar');
        expect(cacheService.ttls.foo).toEqual(jasmine.any(Number));
      }));
    });

    describe('#setTTL', function () {

      beforeEach(module(before));

      it('Sets a ttl on the given key', inject(function (cacheService) {
        cacheService.setTTL('bananas');
        expect(cacheService.ttls.bananas).toEqual(jasmine.any(Number));
      }));
    });

    describe('#get', function () {

      beforeEach(module(before));

      it('Does not hit storage if locally cached', inject(function (cacheService) {
        cacheService.entries.ribs = 'blah';
        expect(cacheService.get('ribs')).toBe('blah');
        expect(storageService.setJSON).not.toHaveBeenCalled();
      }));

      it('Returns from storage if not locally cached', inject(function (cacheService) {
        expect(cacheService.get('order')).not.toBeDefined();
        expect(storageService.getJSON).toHaveBeenCalledWith('order');
      }));
    });
    describe('#add', function () {

      beforeEach(module(before));

      it('Adds an entry', inject(function (cacheService) {
        cacheService.entries.state = ['love'];
        expect(cacheService.add('state', 'heel')).toBe(true);
        expect(storageService.setJSON).toHaveBeenCalledWith('state', ['heel', 'love']);
      }));

      it('Does not add an entry if not locally cached', inject(function (cacheService) {
        expect(cacheService.add('dead', 'organism')).toBe(false);
      }));
    });

    describe('#remove', function () {

      beforeEach(module(before));

      it('Removes from storage', inject(function (cacheService) {
        cacheService.entries.two = 'hot';
        cacheService.remove('two');
        expect(cacheService.entries.two).toBe(null);
        expect(storageService.remove).toHaveBeenCalledWith('two');
      }));
    });

    describe('#ttlExpired', function () {

      beforeEach(module(before));

      it('Removes from storage if expired', inject(function (cacheService) {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        cacheService.ttls.no = +date;
        expect(cacheService.ttlExpired('no')).toBe(true);
        expect(storageService.remove).toHaveBeenCalledWith('no');
        expect(cacheService.ttls.no).toBe(null);
      }));

      it('Does not do anything if no ttl is being tracked', inject(function (cacheService) {
        expect(cacheService.ttlExpired()).toBe(false);
        expect(cacheService.ttlExpired('wha')).toBe(false);
      }));
    });
  });
});
