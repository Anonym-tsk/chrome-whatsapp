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

        // The following *-min tasks produce minifies files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.path.app %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.path.dist %>/images'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.path.app %>',
                    dest: '<%= config.path.dist %>',
                    src: [
                        '_locales/{,*/}*.json',
                        'manifest.json'
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
            },
            opera: {
                options: {
                    archive: 'package/opera-<%= config.package.name %>-<%= config.package.version %>.zip'
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

    grunt.registerTask('check', function() {
        console.log('Checking build...');

        var need = grunt.file.readJSON('build.json'),
            result = true;

        grunt.file.recurse(grunt.config.get('config.path.dist'), function(abspath, rootdir, subdir, filename) {
            var file = subdir ? subdir + '/' + filename : filename,
                index = need.indexOf(file);
            if (index < 0) {
                grunt.log.error('Found unknown file %s!', file);
                result = false;
            } else {
                need.splice(index, 1);
            }
        });

        need.forEach(function(file) {
            grunt.log.error('Required file %s not found!', file);
            result = false;
        });

        if (result) {
            grunt.log.ok();
        }
        return result;
    });

    grunt.registerTask('build-chrome', [
        'jshint',
        'clean',
        'imagemin',
        'copy',
        'check',
        'compress:chrome'
    ]);

    grunt.registerTask('build-opera', [
        'jshint',
        'clean',
        'imagemin',
        'copy',
        'check',
        'compress:opera'
    ]);

    grunt.registerTask('build', [
        'build-chrome',
        'build-opera'
    ]);

    grunt.registerTask('release', [
        'bump',
        'build'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
