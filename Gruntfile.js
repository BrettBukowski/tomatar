module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [
        'Gruntfile.js',
        'public/js/*.js',
        'public/js/controllers/*.js',
        'public/js/filters/*.js',
        'public/js/routes/*.js',
        'public/js/services/*.js',
        'test/client/specs/*.js',
        'lib/**/*.js',
        'app.js'
      ],
      options: {
        expr: true,
        browser: true,
        node: true,
        laxbreak: true,
        eqeqeq: false,
        boss: true,
        validthis: true,
        eqnull: true
      }
    },

    watch: {
      scripts: {
        files: ['public/js/**/*.js', 'test/**/*.js', 'lib/**/*.js'],
        tasks: ['jshint', 'cafemocha']
      },
      karma: {
        files: ['public/js/**/*.js', 'test/client/**/*.js'],
        tasks: ['karma:unit:run']
      }
    },

    karma: {
      unit: {
        configFile: 'config/karma.conf.js',
        background: true
      },
      single: {
        configFile: 'config/karma.conf.js',
        singleRun: true
      },
      dev: {
        reporters: 'dots'
      }
    },

    cafemocha: {
      specs: { src: 'test/server/**/*.js' }
    },

    requirejs: {
      compile: {
        options: {
          out: './public/js/build/main.js',
          name: 'main',
          almond: true,
          baseUrl: './public/js',
          optimize: 'uglify2',
          insertRequire: ['main'],
          mainConfigFile: './public/js/main.js',
          generateSourceMaps: true,
          replaceRequireScript: [{
            files: ['./public/index.html'],
            modulePath: 'js/build/main'
          }],
          preserveLicenseComments: false
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-cafe-mocha');
  grunt.loadNpmTasks('grunt-requirejs');

  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['karma:single', 'cafemocha']);
  grunt.registerTask('build', ['requirejs:compile']);
};
