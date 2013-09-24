/* global describe,it,expect,inject,beforeEach,define,spyOn */
'use strict';

define(['services/User'], function () {
  describe('User Service', function () {
    var httpService, cookies, deferred;

    beforeEach(module('tomatar'));
    beforeEach(module(function ($provide) {
      var defaultResponse = function () {
        return deferred.promise;
      };
      httpService = {
        'post':   defaultResponse,
        'delete': defaultResponse
      };
      $provide.provider('$http', function () {
        this.$get = function () { return httpService; };
      });
      cookies = { signin: '0abcDF34323' };
      $provide.provider('$cookies', function () {
        this.$get = function () { return cookies; };
      });
    }));

    describe('#signedIn', function () {
      it('Reports on the signin cookie', inject(function (userService) {
        expect(userService.signedIn()).toBe(true);
      }));
    });

    describe('#signedIn - when not signed in', function () {
      beforeEach(module(function ($provide) {
        cookies = { signin: '0' };
        $provide.provider('$cookies', function () {
          this.$get = function () { return cookies; };
        });
      }));

      it('Returns false if the cookie exists but does not match', inject(function (userService) {
        expect(userService.signedIn()).toBe(false);
      }));
    });

    describe('#destroy', function () {
      it('Removes the signin cookie', inject(function (userService, $q, $rootScope) {
        deferred = $q.defer();
        deferred.resolve({ data: { result: 'bananas' }});
        spyOn(httpService, 'delete').andCallThrough();
        var result;
        userService.destroy().then(function (actual) { result = actual; });
        $rootScope.$apply();
        expect(httpService['delete']).toHaveBeenCalled();
        expect(cookies.signin).toBeUndefined();
        expect(result).toBe('bananas');
      }));
    });
  });
});
