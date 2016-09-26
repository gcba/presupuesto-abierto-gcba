module.exports = function(grunt) {
    // load grunt tasks based on dependencies in package.json
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-rev');

    grunt.config.init({
        useminPrepare: {
            index: {
                src: ['index.html'],
                options: {
                    dest: 'dist'
                }
            },
            iframe: {
                src: ['iframe.html'],
                options: {
                    dest: 'dist'
                }
            }
        },
        usemin:{
            html:['dist/index.html', 'dist/iframe.html']
        },
        rev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            assets: {
                files: [{
                    src: [
                        'dist/*.{js,css}'
                    ]
                }]
            }
        },
        copy:{
            html: {
                files: [
                    {
                        src: './index.html',
                        dest: 'dist/index.html'
                    },
                    {
                        src: './iframe.html',
                        dest: 'dist/iframe.html'
                    }
                ]
            },
            data: {
                expand: true,
                src: ['Data/*'],
                dest: 'dist/'
            },
            icons: {
                expand: true,
                src: ['icons/**'],
                dest: 'dist/'
            },
            bastrap: {
                files: [
                    {
                        expand: true,
                        src: [ 'bastrap3/*.{png,svg}' ],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: 'bastrap3/fonts/',
                        src: ['**'],
                        dest: 'dist/fonts/'
                    },

                ]}
        }
    });

    grunt.registerTask('default',[
        'copy:html',
        'copy:data',
        'copy:icons',
        'copy:bastrap',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'rev',
        'usemin'
    ]);
}
