module.exports = function(grunt) {
  grunt.initConfig({
    timestamp: +(new Date()),

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
          out: './public/js/<%= timestamp %>/main.js',
          name: 'main',
          almond: true,
          baseUrl: './public/js',
          optimize: 'uglify2',
          insertRequire: ['main'],
          mainConfigFile: './public/js/main.js',
          generateSourceMaps: true,
          replaceRequireScript: [{
            files: ['./public/index.html'],
            modulePath: 'js/<%= timestamp %>/main'
          }],
          preserveLicenseComments: false
        }
      },

      combineCss: {
        options: {
          cssIn: './public/css/<%= timestamp %>.css',
          out: './public/css/<%= timestamp %>.css'
        }
      }
    },

    less: {
      compile: {
        options: {
          yuicompress: true,
          strictImports: true
        },
        files: {
          './public/css/<%= timestamp %>.css': './public/css/main.css.less'
        }
      }
    },

    rewriteCssPath: {
      all: {
        options: {
          files: ['./public/index.html'],
          path: {
            'css/main.css': 'css/<%= timestamp %>.css'
          }
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-cafe-mocha');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['karma:single', 'cafemocha']);
  grunt.registerTask('build', ['requirejs:compile', 'less:compile', 'requirejs:combineCss', 'rewriteCssPath']);

  grunt.registerMultiTask('rewriteCssPath', 'Rewrites the path in an html file to the css file', function () {
    grunt.task.requires('less:compile');

    var options = this.options(),
        files = grunt.file.expand(options.files),
        replacements = options.path;

    function replace (content, search, replaceWith) {
      return content.replace(new RegExp(search, 'g'), replaceWith);
    }

    files.forEach(function (file) {
      var content = String(grunt.file.read(file, 'utf-8'));

      for (var i in replacements) {
        content = replace(content, i, replacements[i]);
      }

      grunt.file.write(file, content);
    });
  });
};
