'use strict';

/**
 * @param {grunt} grunt
 */
module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({

        // Project config
        config: {
            path: {
                app: 'app',
                dist: 'dist',
                package: 'package'
            },
            package: grunt.file.readJSON('package.json'),
            manifest: grunt.file.readJSON('app/manifest.json')
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= config.path.app %>/scripts/{,*/}*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['<%= config.path.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:debug']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            styles: {
                files: ['<%= config.path.app %>/styles/{,*/}*.css'],
                tasks: [],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.path.app %>/*.html',
                    '<%= config.path.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= config.path.app %>/manifest.json',
                    '<%= config.path.app %>/_locales/{,*/}*.json'
                ]
            }
        },

        // Grunt server and debug server setting
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            debug: {
                options: {
                    open: false,
                    base: [
                        '<%= config.path.app %>'
                    ]
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.path.dist %>/*',
                        '!<%= config.path.dist %>/.git*'
                    ]
                }]
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                node: true,
                browser: true,
                esnext: true,
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                quotmark: 'single',
                regexp: true,
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                smarttabs: true,
                validthis: true,
                globals: {
                    chrome: true,
                    opr: true,
                    define: true
                },
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.path.app %>/scripts/{,*/}*.js'
            ]
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                style: 'compressed',
                sourcemap: 'none'
            },
            debug: {
                options: {
                    style: 'expanded',
                    update: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.path.app %>/styles',
                    src: ['*.sass'],
                    dest: '<%= config.path.app %>/styles',
                    ext: '.css'
                }]
            },
            compressed: {
                files: [{
                    expand: true,
                    cwd: '<%= config.path.app %>/styles',
                    src: ['*.sass'],
                    dest: '<%= config.path.dist %>/styles',
                    ext: '.css'
                }]
            }
        },

        // Minify scripts
        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.path.app %>/scripts',
                    src: [
                        '{,*/}*.js'
                    ],
                    dest: '<%= config.path.dist %>/scripts'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            assets: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.path.app %>',
                    dest: '<%= config.path.dist %>',
                    src: [
                        '_locales/{,*/}*.json',
                        'manifest.json',
                        'images/{,*/}*.{gif,jpeg,jpg,png}',
                        'index.html'
                    ]
                }]
            }
        },

        // Compres dist files to package
        compress: {
            chrome: {
                options: {
                    archive: 'package/chrome-<%= config.package.name %>-<%= config.package.version %>.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: ''
                }]
            }
        },

        // Bump version
        bump: {
            options: {
                files: ['package.json', '<%= config.path.app %>/manifest.json'],
                updateConfigs: ['config.package', 'config.manifest'],
                commit: true,
                commitMessage: 'Release %VERSION%',
                commitFiles: ['package.json', '<%= config.path.app %>/manifest.json'],
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false
            }
        }
    });

    grunt.registerTask('debug', [
        'jshint',
        'sass:debug',
        'connect:debug',
        'watch'
    ]);

    grunt.registerTask('build', [
        'jshint',
        'clean',
        'sass:compressed',
        'uglify',
        'copy:assets',
        'compress:chrome'
    ]);

    grunt.registerTask('release', [
        'bump',
        'build'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
