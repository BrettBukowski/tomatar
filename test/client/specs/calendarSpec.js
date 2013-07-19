/* global describe,it,expect,inject,beforeEach,define,jasmine,spyOn */
'use strict';

define(['services/Calendar'], function () {
  describe('Calendar Service', function() {

    beforeEach(module('tomatar'));

    describe('#partition', function () {
      it('Handles empty input', inject(function (calendarService) {
        expect(calendarService.partition()).toEqual([]);
        expect(calendarService.partition(0)).toEqual([]);
        expect(calendarService.partition([])).toEqual([]);
      }));

      it('Partitions months', inject(function (calendarService) {
        var entries = [
          { date: '2013-07-01Tsdf', notes: 'bananas' },
          { date: '2013-05-23Tsdf', notes: 'fry' }
        ];
        var result = calendarService.partition(entries);
        expect(result.length).toBe(2);
        var firstItem = result[0];
        expect(firstItem.month).toEqual('2013-07');
        expect(firstItem.days.length).toBe(1);
        expect(firstItem.days[0].dayOfMonth).toBe(1);
        expect(firstItem.days[0].finished.length).toBe(1);
        expect(firstItem.days[0].finished[0]).toEqual(entries[0]);

        var secondItem = result[1];
        expect(secondItem.month).toEqual('2013-05');
        expect(secondItem.days.length).toBe(1);
        expect(secondItem.days[0].dayOfMonth).toBe(23);
        expect(secondItem.days[0].finished.length).toBe(1);
        expect(secondItem.days[0].finished[0]).toEqual(entries[1]);
      }));

      it('Partitions days', inject(function (calendarService) {
        var entries = [
          { date: '2013-07-02Tsdf', notes: 'lean' },
          { date: '2013-07-01Tsdf', notes: 'bananas' },
          { date: '2013-07-01Tsdf', notes: 'fry' }
        ];
        var result = calendarService.partition(entries);
        expect(result.length).toBe(1);
        var month = result[0];
        expect(month.month).toEqual('2013-07');
        expect(month.days.length).toBe(2);
        expect(month.days[0].dayOfMonth).toBe(1);
        expect(month.days[1].dayOfMonth).toBe(2);
        expect(month.days[0].finished.length).toBe(2);
        expect(month.days[0].finished[0]).toEqual(entries[2]);
        expect(month.days[0].finished[1]).toEqual(entries[1]);
        expect(month.days[1].finished.length).toBe(1);
        expect(month.days[1].finished[0]).toEqual(entries[0]);
      }));
    });

  });
});
