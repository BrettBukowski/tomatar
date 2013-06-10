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
        expect(padSecondsFilter('8:16 AM')).toEqual('8:16 AM');
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

    describe('truncate', function () {
      it('Does not touch <= 40 chars', inject(function (truncateFilter) {
        expect(truncateFilter('bananas')).toEqual('bananas');
        expect(truncateFilter(new Array(41).join('f')).length).toEqual(40);
      }));

      it('Truncates at 39 and adds an ellipsis char', inject(function (truncateFilter) {
        expect(truncateFilter(new Array(42).join('f')).length).toEqual(40);
        expect(truncateFilter(new Array(42).join('f')).charAt(39)).toEqual('…');
      }));

      it('Honors a supplied truncation limit', inject(function (truncateFilter) {
        expect(truncateFilter(new Array(57).join('f'), 51).length).toEqual(51);
        expect(truncateFilter('bananas', 4)).toEqual('ban…');
      }));
    });

    describe('formatDate', function () {
      it('Handles expected input', inject(function (formatDateFilter) {
        expect(formatDateFilter('1902-01-23')).toEqual('January 23, 1902');
      }));

      it('Returns what it does not know what to deal with', inject(function (formatDateFilter) {
        expect(formatDateFilter('19020123')).toEqual('19020123');
      }));
    });
  });
});
