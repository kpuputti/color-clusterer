/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        meta: {
            version: '0.1.0',
            banner: '/*! Color Clusterer - v<%= meta.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* http://kpuputti.github.com/color-clusterer/\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                'Kimmo Puputti; Licensed MIT */'
        },
        lint: {
            files: ['grunt.js', 'src/js/**/*.js']
        },
        concat: {
            dist: {
                src: ['<banner:meta.banner>', 'src/js/app.js'],
                dest: 'dist/app.js'
            }
        },
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest: 'dist/app.min.js'
            }
        },
        exec: {
            sass: {
                command: 'compass compile',
                stdout: true
            }
        },
        watch: {
            scripts: {
                files: '<config:lint.files>',
                tasks: 'lint concat min'
            },
            sass: {
                files: 'src/sass/app.scss',
                tasks: 'exec'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {}
        },
        uglify: {}
    });

    grunt.loadNpmTasks('grunt-exec');

    // Default task.
    grunt.registerTask('default', 'lint concat min exec');

};
