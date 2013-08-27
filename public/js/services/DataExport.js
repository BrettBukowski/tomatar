define(['app', 'angular', 'services/Storage'], function (app, angular) {
  "use strict";

  return app.service('dataExportService', ['storageService', function (storageService) {
    var mapping = ['date', 'time', 'duration', 'notes'];

    function Exporter () {
      this.entries = [];
    }
    Exporter.prototype.addEntries = function (entries) {
      this.entries = this.entries.concat(this._addEntries(entries));
    };
    Exporter.prototype.save = function () {
      storageService.saveTextFile(this.stringify(), this.name);
    };

    function CSVExporter () {
      Exporter.call(this);
    }
    CSVExporter.prototype = {
      name: 'download.csv',

      stringify: function () {
        return mapping + "\n" + this.entries.join("\n");
      },

      _addEntries: function (entries) {
        return entries.map(function (entry) {
          var mapped = [];
          mapping.forEach(function (key) {
            mapped.push(entry[key]);
          });
          return mapped.join(',');
        }).join("\n");
      }
    };
    angular.extend(CSVExporter.prototype, Exporter.prototype);

    function JSONExporter () {
      Exporter.call(this);
    }
    JSONExporter.prototype = {
      name: 'download.json',

      stringify: function () {
        return angular.toJson(this.entries, true);
      },

      _addEntries: function (entries) {
        return entries.map(function (entry) {
          var mapped = {};
          mapping.forEach(function (key) {
            mapped[key] = entry[key];
          });
          return mapped;
        });
      }
    };
    angular.extend(JSONExporter.prototype, Exporter.prototype);

    this.export = function (type) {
      return (type == 'csv') ? new CSVExporter() : new JSONExporter();
    };
  }]);
});
