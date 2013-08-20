/* global describe,it,expect,inject,beforeEach,define,jasmine,spyOn,angular */
'use strict';

define(['services/DataExport'], function () {
  describe('DataExport Service', function() {
    var storageService,
        input = [{
            notes: 'bananas',
            time: 'blah',
            date: 'beep',
            duration: 54
          }, {
            notes: 'huerco',
            duration: 1,
            time: '3:34',
            date: '2/3/32'
          }];

    beforeEach(module('tomatar'));
    beforeEach(module(function ($provide) {
      storageService = { saveTextFile: function(){} };
      spyOn(storageService, 'saveTextFile');
      $provide.provider('storageService', function () {
        this.$get = function () { return storageService; };
      });
    }));

    describe('#save - csv', function () {
      it('Saves empty input as just the header - csv', inject(function (dataExportService) {
        dataExportService.export('csv').save();
        expect(storageService.saveTextFile).toHaveBeenCalledWith("date,time,duration,notes\n", 'download.csv');
      }));

      it('Saves entries', inject(function (dataExportService) {
        var exporter = dataExportService.export('csv');
        exporter.addEntries(input);
        exporter.save();
        var expected = [
          "date,time,duration,notes",
          "beep,blah,54,bananas",
          "2/3/32,3:34,1,huerco"
        ];
        expect(storageService.saveTextFile).toHaveBeenCalledWith(expected.join("\n"), 'download.csv');
      }));
    });

    describe('#save - json', function () {
      it('Saves empty input as an empty array - json', inject(function (dataExportService) {
        dataExportService.export('json').save();
        expect(storageService.saveTextFile).toHaveBeenCalledWith("[]", 'download.json');
      }));

      it('Saves entries', inject(function (dataExportService) {
        var exporter = dataExportService.export('json');
        exporter.addEntries(input);
        exporter.save();
        var expected = [{
          date: input[0].date,
          time: input[0].time,
          duration: input[0].duration,
          notes: input[0].notes
        }, {
          date: input[1].date,
          time: input[1].time,
          duration: input[1].duration,
          notes: input[1].notes
        }];
        expect(storageService.saveTextFile).toHaveBeenCalledWith(angular.toJson(expected, true), 'download.json');
      }));
    });
  });
});
