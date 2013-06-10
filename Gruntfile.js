module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [
        'Gruntfile.js',
        'public/js/**/*.js',
        'test/client/**/*.js',
        'lib/**/*.js',
        'app.js'
      ],
      options: {
        expr: true,
        browser: true,
        node: true
      }
    },

    watch: {
      scripts: {
        files: ['public/js/**/*.js', 'test/client/**/*.js'],
        tasks: ['jshint']
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
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['karma:single']);
};
