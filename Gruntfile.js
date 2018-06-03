'use strict';

module.exports = function (grunt) {

  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch(e) {
    localConfig = {};
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    buildcontrol: 'grunt-build-control',
    gitinfo: 'grunt-gitinfo',
    replace: 'grunt-text-replace',
    jshint: 'grunt-contrib-jshint'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    gitinfo: {},

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    yeoman: {
      // configurable paths
      client: require('./bower.json').appPath || 'client',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server/app.js',
          debug: false
        }
      },
      debugServer: {
        options: {
          script: 'server/app.js',
          debug: false,
          opts: ['--inspect', '--debug-brk']
        }
      },
      prod: {
        options: {
          script: 'dist/server/app.js'
        }
      }
    },
    watch: {
      injectJS: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.js',
          '!<%= yeoman.client %>/{app,components}/**/*.spec.js',
          '!<%= yeoman.client %>/{app,components}/**/*.mock.js',
          '!<%= yeoman.client %>/app/app.js'],
        tasks: ['injector:scripts']
      },
      injectLess: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.less'],
        tasks: ['injector:less']
      },
      less: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.less'],
        tasks: ['less', 'autoprefixer']
      },
      jade: {
        files: [
          '<%= yeoman.client %>/{app,components}/*',
          '<%= yeoman.client %>/{app,components}/**/*.jade'],
        tasks: ['jade']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.css',
          '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.html',

          '<%= yeoman.client %>/{app,components}/**/*.js',

          '!<%= yeoman.client %>/{app,components}/**/*.spec.js',
          '!<%= yeoman.client %>/{app,components}/**/*.mock.js',
          '<%= yeoman.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true // without this option specified express won't be reloaded
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*',
            '!<%= yeoman.dist %>/.openshift',
            '!<%= yeoman.dist %>/Procfile'
          ]
        }]
      },
      temp: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: '{,*/}*.css',
          dest: '.tmp/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: '<%= yeoman.client %>/index.html',
        ignorePath: '<%= yeoman.client %>/',
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, /bootstrap.css/, /font-awesome.css/ ]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/public/{,*/}*.js',
            '<%= yeoman.dist %>/public/{,*/}*.css',
            //'<%= yeoman.dist %>/public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/public/assets/fonts/*',
            '!<%= yeoman.dist %>/public/bower_components/*.css',
            '!<%= yeoman.dist %>/public/bower_components/*.js'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= yeoman.client %>/index.html'],
      options: {
        dest: '<%= yeoman.dist %>/public',
        flow: {
          steps: {
            js: [
              'concat'
              //'uglify'
            ],
            css: [
              'concat',
              'cssmin'
            ]
          },
          post: {}
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/public/{,*/}*.html'],
      css: [
        '<%= yeoman.dist %>/public/{,*/}*.css',
        '!<%= yeoman.dist %>/public/bower_components/*.css'
      ],
      js: [
        '<%= yeoman.dist %>/public/{,*/}*.js',
        '!<%= yeoman.dist %>/public/bower_components/*.js'
      ],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>/public'
          //'<%= yeoman.dist %>/public/assets/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          js: [
            //[/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '**/*.js',
          dest: '.tmp/concat'
        }]
      }
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      options: {
        // This should be the name of your apps angular module
        module: 'projectsApp',
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        usemin: 'app/app.js'
      },
      tmp: {
        cwd: '.tmp',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/tmp-templates.js'
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.client %>',
          dest: '<%= yeoman.dist %>/public',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/font-awesome/fonts/*',
            'assets/fonts/**/*',
            'assets/images/*',
            'components/**/*.{png,jpg,jpeg,gif,svg}',
            'index.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/public/assets/images',
          src: ['generated/*']
        }, {
          expand: true,
          dest: '<%= yeoman.dist %>',
          src: [
            'package.json',
            'Dockerfile',
            'server/**/*'
          ]
        }]
      },
      clientJs2dist: {
        expand: true,
        cwd: '<%= yeoman.client %>',
        dest: '<%= yeoman.dist %>/public',
        src: ['{app,components}/**/*.js']
      },
      tmp2dist: {
        expand: true,
        cwd: '.tmp',
        dest: '<%= yeoman.dist %>/public',
        src: ['**/*']
      },
      bowerComponents2dist: {
        expand: true,
        cwd: '<%= yeoman.client %>',
        src: ['bower_components/**/*'],
        dest: '<%= yeoman.dist %>/public'
      }
    },

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      heroku: {
        options: {
          remote: 'heroku',
          branch: 'master'
        }
      },
      openshift: {
        options: {
          remote: 'openshift',
          branch: 'master'
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      compile: [
        'jade',
        'less'
        //'imagemin',
        //'svgmin'
      ]
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    // Compiles Jade to html
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>',
          src: [
            '{app,components}/**/*.jade'
          ],
          dest: '.tmp',
          ext: '.html'
        }]
      }
    },

    // Compiles Less to CSS
    less: {
      options: {
        paths: [
          '<%= yeoman.client %>/bower_components',
          '<%= yeoman.client %>/app',
          '<%= yeoman.client %>/components'
        ]
      },
      client: {
        files: {
          '.tmp/app/app.css' : '<%= yeoman.client %>/app/app.less'
        }
      }
    },

    injector: {
      options: {},

      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/client/', '');
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= yeoman.client %>/index.html': [
            '<%= yeoman.client %>/{app,components}/**/*.js',

            '!<%= yeoman.client %>/app/app.js',
            '!<%= yeoman.client %>/{app,components}/**/*.spec.js',
            '!<%= yeoman.client %>/{app,components}/**/*.mock.js'
          ]
        }
      },

      // Inject component less into app.less
      less: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/app/', '');
            filePath = filePath.replace('/client/components/', '');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%= yeoman.client %>/app/app.less': [
            '<%= yeoman.client %>/{app,components}/**/*.less',
            '!<%= yeoman.client %>/app/app.less'
          ]
        }
      }

    },

    replace: {
      appVer: {
        src: ['dist/public/app/*.app.js'],
        overwrite: true,
        replacements: [
          {
            from: 'APP_VERSION="unknown"',
            to: 'APP_VERSION="<%= gitinfo.local.branch.current.SHA %>"'
          }]
      },
      serveClient: {
        src: ['dist/server/app.js'],
        overwrite: true,
        replacements: [
          {
            from: "serveClient: config.env !== 'production',", // jshint ignore:line
            to: 'serveClient: true,'
          }]
      },
      swaggerHost: {
        src: ['dist/server/swagger.yaml'],
        overwrite: true,
        replacements: [
          {
            from: '127.0.0.1:9000',
            to: '127.0.0.1:8080'
          }]
      }
    },

    jshint: {
      options: {
        jshintrc: '<%= yeoman.client %>/.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: 'server/.jshintrc'
        },
        src: [
          'server/**/*.js'
        ]
      },
      client: [
        '<%= yeoman.client %>/{app,components}/**/*.js'
      ]
    },

    shell: {
      mocha: {
        command: 'mocha --exit server/**/*.spec.js',
        options: {
          execOptions: {
            env: {
              'NODE_ENV': 'test'
            }
          }
        }
      },
      uglifyAppJs: {
        command: 'node node_modules/uglify-es/bin/uglifyjs dist/public/app/app.js --compress -o dist/public/app/app.js'
      },
      uglifyVendorJs: {
        command: 'node node_modules/uglify-es/bin/uglifyjs dist/public/app/vendor.js --compress -o dist/public/app/vendor.js'
      }
    }

  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('lint-js', function () {
    grunt.task.run([
      'jshint:client',
      'jshint:server'
    ]);
  });

  grunt.registerTask('prepare-dev', function () {
    grunt.task.run([
      'clean:temp',
      'lint-js',
      'env:all',
      'injector:less',
      'concurrent:compile',
      'injector:scripts',
      'wiredep',
      'autoprefixer'
    ]);
  });

  grunt.registerTask('serve', function () {
    grunt.task.run([
      'prepare-dev',
      'express:dev',
      'wait',
      'watch'
    ]);
  });

  grunt.registerTask('debugServer', function () {
    grunt.task.run([
      'prepare-dev',
      'express:debugServer',
      'wait',
      'watch'
    ]);
  });

  //grunt.registerTask('printConfig', function() {
  //  grunt.log.writeln(JSON.stringify(grunt.config(), null, 2));
  //});

  grunt.registerTask('uglifyJs', function () {
    grunt.task.run([
      'shell:uglifyVendorJs',
      'shell:uglifyAppJs'
    ]);
  });

  grunt.registerTask('common-build', function () {
    grunt.task.run([
      'lint-js',
      'shell:mocha',
      'clean:dist',
      'gitinfo',
      'injector:less',
      'concurrent:compile',
      'injector:scripts',
      'wiredep'
    ]);
  });

  grunt.registerTask('build', [
    'common-build',
    'useminPrepare',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    //'uglify',
    'uglifyJs',
    'rev',
    'usemin',
    'replace:appVer',
    'replace:swaggerHost'
  ]);

  grunt.registerTask('build-debug', [
    'common-build',
    'autoprefixer',
    'copy:dist',
    'copy:clientJs2dist',
    'copy:tmp2dist',
    'copy:bowerComponents2dist',
    'replace:appVer',
    'replace:serveClient',
    'replace:swaggerHost'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
