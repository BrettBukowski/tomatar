'use strict';

define(['filters/Filter'], function () {

  describe('filter', function () {
    beforeEach(module('tomatar'));

    describe('padSeconds', function () {

      it('Handles numbers', inject(function (padSecondsFilter) {
        expect(padSecondsFilter(10)).toEqual(10);
        expect(padSecondsFilter(0)).toEqual('00');
        expect(padSecondsFilter(9)).toEqual('09');
      }));

      it('Handles time-formatted strings', inject(function (padSecondsFilter) {
        expect(padSecondsFilter('10:27')).toEqual('10:27');
        expect(padSecondsFilter('9:27')).toEqual('9:27');
        expect(padSecondsFilter('9:7')).toEqual('9:07');
      }));
    });

    describe('timeInterval', function () {

      it('subtracts minutes', inject(function (timeIntervalFilter) {
        expect(timeIntervalFilter('2:45', 1)).toEqual('2:44');
        expect(timeIntervalFilter('2:45', 60)).toEqual('1:45');
        expect(timeIntervalFilter('2:45', 0)).toEqual('2:45');
      }));

      it('handles hour changes', inject(function (timeIntervalFilter) {
        expect(timeIntervalFilter('2:45', 46)).toEqual('1:59');
        expect(timeIntervalFilter('2:45', 120)).toEqual('12:45');
      }));
    });

  });

});
