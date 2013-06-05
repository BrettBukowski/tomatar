module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js', 'test/**/*.js'],
      options: {
        expr: true,
        browser: true,
        node: true
      }
    },

    watch: {
      scripts: {
        files: ['js/**/*.js', 'test/**/*.js'],
        tasks: ['jshint']
      },
      karma: {
        files: ['js/**/*.js', 'test/**/*.js'],
        tasks: ['karma:unit:run']
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: true
      },
      continuous: {
        singleRun: true,
        browsers: ['Firefox']
      },
      dev: {
        reporters: 'dots'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['karma:continuous']);
};
