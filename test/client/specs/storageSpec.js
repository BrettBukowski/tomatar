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

    describe('#saveTextFile', function () {
      var mockLink, mockDoc;

      beforeEach(module(function ($provide) {
        mockLink = {
          click: jasmine.createSpy(),
          style: {}
        };
        $provide.value('$document', mockDoc = {
          createElement: function () {}
        });
        $provide.value('$window', mockWindow = {
          Blob: function () {},
          webkitURL: { createObjectURL: function () {} }
        });
      }));

      it('Builds a link constructed to download a file (webkit)', inject(function (storageService) {
        spyOn(mockDoc, 'createElement').andReturn(mockLink);
        spyOn(mockWindow, 'Blob').andReturn('foo');
        spyOn(mockWindow.webkitURL, 'createObjectURL').andReturn('RESULT');
        var result = storageService.saveTextFile('bananas', 'dance.md');
        expect(result).toEqual('RESULT');
        expect(mockLink.click).toHaveBeenCalled();
      }));

      it('Inserts the link into the DOM before clicking it (FF)', inject(function (storageService) {
        mockWindow.URL = mockWindow.webkitURL;
        mockWindow.webkitURL = null;

        mockDoc.body = {
          appendChild: jasmine.createSpy()
        };

        spyOn(mockDoc, 'createElement').andReturn(mockLink);
        spyOn(mockWindow, 'Blob').andReturn('foo');
        spyOn(mockWindow.URL, 'createObjectURL').andReturn('RESULT');
        var result = storageService.saveTextFile('bananas', 'dance.md');
        expect(result).toEqual('RESULT');
        expect(mockDoc.body.appendChild).toHaveBeenCalledWith(mockLink);
        expect(mockLink.click).toHaveBeenCalled();
      }));
    });
  });
});
