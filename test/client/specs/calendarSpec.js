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
        expect(calendarService.partition(
          [null, undefined, 0, '', false, { notes: 'blah' }])).toEqual([]);
      }));

      it('Partitions months', inject(function (calendarService) {
        var entries = [
          { date: '2013-07-01Tsdf', notes: 'bananas' },
          { date: '2013-05-23Tsdf', notes: 'fry' },
          { date: '2003-05-23Tsdf', notes: 'older' },
          { date: '2013-08-12Tsdf', notes: 'voter' },
          { date: '2013-06-12Tsdf', notes: 'some' }
        ];
        var result = calendarService.partition(entries),
            item;

        expect(result.length).toBe(5);

        item = result[0];
        expect(item.month).toEqual('2013-08');
        expect(item.days.length).toBe(1);
        expect(item.days[0].dayOfMonth).toBe(12);
        expect(item.days[0].finished.length).toBe(1);
        expect(item.days[0].finished[0]).toEqual(entries[3]);

        item = result[1];
        expect(item.month).toEqual('2013-07');
        expect(item.days.length).toBe(1);
        expect(item.days[0].dayOfMonth).toBe(1);
        expect(item.days[0].finished.length).toBe(1);
        expect(item.days[0].finished[0]).toEqual(entries[0]);

        item = result[2];
        expect(item.month).toEqual('2013-06');
        expect(item.days.length).toBe(1);
        expect(item.days[0].dayOfMonth).toBe(12);
        expect(item.days[0].finished.length).toBe(1);
        expect(item.days[0].finished[0]).toEqual(entries[4]);

        item = result[3];
        expect(item.month).toEqual('2013-05');
        expect(item.days.length).toBe(1);
        expect(item.days[0].dayOfMonth).toBe(23);
        expect(item.days[0].finished.length).toBe(1);
        expect(item.days[0].finished[0]).toEqual(entries[1]);

        item = result[4];
        expect(item.month).toEqual('2003-05');
        expect(item.days.length).toBe(1);
        expect(item.days[0].dayOfMonth).toBe(23);
        expect(item.days[0].finished.length).toBe(1);
        expect(item.days[0].finished[0]).toEqual(entries[2]);
      }));

      it('Partitions days', inject(function (calendarService) {
        var entries = [
          { date: '2013-07-02Tsdf', notes: 'lean' },
          { date: '2013-07-01Tsdf', notes: 'bananas' },
          { date: '2013-07-01Tsdf', notes: 'fry' },
          { date: '2013-07-27Tsdf', notes: 'clay' }
        ];
        var result = calendarService.partition(entries);
        expect(result.length).toBe(1);
        var month = result[0];
        expect(month.month).toEqual('2013-07');
        expect(month.days.length).toBe(3);
        expect(month.days[0].dayOfMonth).toBe(1);
        expect(month.days[1].dayOfMonth).toBe(2);
        expect(month.days[2].dayOfMonth).toBe(27);
        expect(month.days[0].finished.length).toBe(2);
        expect(month.days[0].finished[1]).toEqual(entries[2]);
        expect(month.days[0].finished[0]).toEqual(entries[1]);
        expect(month.days[1].finished.length).toBe(1);
        expect(month.days[1].finished[0]).toEqual(entries[0]);
        expect(month.days[2].finished.length).toBe(1);
        expect(month.days[2].finished[0]).toEqual(entries[3]);
      }));

      it('Sorts by time: oldest → newest', inject(function (calendarService) {
        var entries = [
          { date: '2013-07-02Tsdf', notes: 'fellow', time: '10:01' },
          { date: '2013-07-02Tsdf', notes: 'cast', time: '12:27' },
          { date: '2013-07-02Tsdf', notes: 'flick', time: '19:51' },
          { date: '2013-07-02Tsdf', notes: 'sound', time: '09:01' }
        ];
        var result = calendarService.partition(entries);

        expect(result.length).toBe(1);

        var actual = result[0].days[0].finished;

        expect(actual.length).toBe(4);
        expect(actual[0]).toEqual(entries[3]);
        expect(actual[1]).toEqual(entries[0]);
        expect(actual[2]).toEqual(entries[1]);
        expect(actual[3]).toEqual(entries[2]);
      }));
    });

  });
});
