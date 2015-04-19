//
// grunt-json-min
// https://github.com/jahed/grunt-json-min
//
// Copyright (c) 2014 Jahed Ahmed
// Licensed under the MIT license.
//

'use strict';

module.exports = function(grunt) {

    grunt.task.registerTask('default', ['clean', 'jshint', 'build']);
    grunt.task.registerTask('build', ['json-format']);

    grunt.task.loadTasks('tasks');
    grunt.task.loadNpmTasks('grunt-contrib-jshint');
    grunt.task.loadNpmTasks('grunt-contrib-clean');

    grunt.config.init({
        clean: {
            build: ['./build']
        },
        jshint: {
            all: [
                'gruntfile.js',
                'tasks/*.js'
            ],
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: '.jshintrc'
            }
        },

        'json-format': {
            'no-options': {
                files: [
                    {
                        expand: true,
                        cwd: './test',
                        src:  ['./json/test-no-options.json'],
                        dest: './build/'
                    }
                ]
            },
            indent: {
                options: {
                    space: 4
                },
                files: [
                    {
                        expand: true,
                        cwd: './test',
                        src:  ['./json/test-indent-4.json'],
                        dest: './build/'
                    }
                ]
            },
            remove: {
                options: {
                    remove: ['_comment']
                },
                files: [
                    {
                        expand: true,
                        cwd: './test',
                        src:  ['./json/test-remove-comment.json'],
                        dest: './build/'
                    }
                ]
            }
        }
    });

};
