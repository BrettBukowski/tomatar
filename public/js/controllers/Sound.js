define(['jquery', 'app', 'services/Settings'], function ($, app) {
  "use strict";

  return app.controller('SoundController', ['$rootScope', '$scope', '$sce', 'settingsService', function (rootScope, scope, sce, settingsService) {
    var path = 'audio',
        types = { mp3: 'audio/mp3', wav: 'audio/wav' };

    function getSource (soundName) {
      if (!soundName) return;

      var filePath = path + '/' + soundName.toLowerCase(),
          test = $('<audio>')[0];

      for (var i in types) {
        if (test.canPlayType(types[i])) {
          return {
            type: types[i],
            path: filePath + '.' + i
          };
        }
      }
    }

    scope.setSound = function (sound) {
      var source = getSource(sound);

      // Browsers don't download the new src unless the innerHTML of the audio
      // element is completely rewritten. So rather than just using regular ng binding,
      // forced to use unsafe-html binding.
      var newSource = (source)
        ? '<source type="' + source.type + '" src="' + source.path + '">'
        : '';

      if (newSource != scope.source) {
        scope.source = sce.trustAsHtml(newSource);
      }
    };

    scope.playSound = function () {
      if (scope.source) {
        $('#soundNotification')[0].play();
      }
    };

    rootScope.$on('setSound', function (evt, sound, play) {
      scope.setSound(sound);
      if (play) {
        scope.playSound();
      }
    });
    rootScope.$on('timer', scope.playSound);
    rootScope.$on('settingsSaved', function (evt, settings) {
      scope.setSound(settings.alarms.sounds.current);
    });

    settingsService.get().then(function (settings) {
      scope.setSound(settings.alarms.sounds.current);
      !scope.$$phase && scope.$apply();
    });
  }]);
});
