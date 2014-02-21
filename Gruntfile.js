module.exports = function (grunt) {
  grunt.initConfig({
    meta: {
      pkg: require('./package.json'),
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      runner: ['runner/**/*.js'],
      task: ['task/**/*.js'],
      tests: ['test/**/*.js'],
      changed: '<%= watch.files.changed %>'
    },
    multi: {
      tara: {},
      tyler: {}
    },
    concat: {
      options: {
        banner: '/*! <%= meta.pkg.name %> - v<%= meta.pkg.version %>\n' +
          ' *  License: <%= meta.pkg.licenses[0].type %>\n' +
          ' *  Date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' */\n'
      },
      test: {
        src: 'test/fixtures/files/*.js',
        dest: 'tmp/concat.js'
      }
    },
    watch: {
      files: {
        files: ['test/fixtures/**/*.js'],
        tasks: ['series1', 'jshint:changed']
      },
      tasks: {
        options: { spawn: true },
        files: ['test/fixtures/tasks/*.js'],
        tasks: ['series0']
      },
      custom: {
        files: ['test/fixtures/**/*.js'],
        // Specify a custom task runner of your choosing
        tasks: function (target, options, done) {
          // Get changed files
          var changedFiles = grunt.config(target + '.changed');
          // Do something custom
          grunt.log.writeln('My custom task runner for ' + target);
          // Call when done
          done();
        }
      },
    }
  });
  grunt.registerTask('series0', function () {
    var done = this.async();
    setTimeout(function () {
      console.log('series0');
      done();
    }, 1000);
  });
  grunt.registerTask('series1', function () {
    var done = this.async();
    setTimeout(function () {
      console.log('series1');
      done();
    }, 400);
  });
  grunt.registerTask('series2', function () {
    console.log('series2');
  });
  grunt.registerTask('single', function () {
    console.log(this);
  });
  grunt.registerMultiTask('multi', function () {
    console.log(this);
  });

  grunt.loadTasks('watch');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('nestedAlias', 'jshint')
  grunt.registerTask('deeplyNestedAlias', 'nestedAlias');
  grunt.registerTask('series', ['series0', 'series1', 'series2']);
  grunt.registerTask('default', 'deeplyNestedAlias');
};
