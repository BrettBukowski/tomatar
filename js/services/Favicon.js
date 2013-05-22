define(['app'], function (app) {
  "use strict";

  return app.factory('faviconService', ['$window', function (win) {
    function Favicon () {
      this.canvas = this._createCanvas();
      this.link = this._createLink();
      this.refresh(0);
    }

    Favicon.prototype = {
      refresh: function (percentComplete) {
        var tiers = this._updateIntervals,
            directive;

        for (var i = 0, len = tiers.length, current, next; i < len; i++) {
          current = this._updateIntervals[i];
          next = this._updateIntervals[i + 1];

          if (!next || (percentComplete >= current.tier && percentComplete < next.tier)) {
            directive = current;
            break;
          }
        }

        if (directive.tier !== this._currentTier) {
          this._drawCanvas(directive);
          this.link.href = this.canvas.toDataURL();
          this._currentTier = directive.tier;
        }
      },

      _drawCanvas: function (directive) {
        var canvas = this.canvas,
            context = canvas.getContext('2d'),
            x = canvas.width / 2,
            y = canvas.height / 2,
            radius = x,
            pi = Math.PI;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Outline
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * pi, false);
        context.lineWidth = 1;
        context.strokeStyle = '#fff';
        context.stroke();

        // Filled arc
        context.beginPath();
        context.fillStyle = '#ff4700';
        context.arc(x, y, radius, directive.start * pi, directive.end * pi, 'anticlockwise' in directive);
        context.fill();
      },

      _createLink: function () {
        var link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';

        return document.head.appendChild(link);
      },

      _updateIntervals: [
        { tier: 0, start: 0, end: 2 },
        { tier: 8, start: 1.2, end: 1.8, anticlockwise: true },
        { tier: 20, start: 1.8, end: 1.2 },
        { tier: 50, start: 1, end: 2, anticlockwise: true },
        { tier: 70, start: 0.2, end: 0.8 },
        { tier: 90, start: 0.6, end: 0.4, anticlockwise: true },
        { tier: 100, start: 0, end: 0 }
      ],

      _createCanvas: function () {
        var canvas = document.createElement('canvas');
        canvas.height = 100;
        canvas.width = 100;

        return canvas;
      }
    };

    return Favicon;
  }]);
});
