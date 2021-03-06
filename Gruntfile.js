module.exports = function (grunt) {
    [
        'grunt-cafe-mocha',
        'grunt-contrib-jshint',
        'grunt-exec',
    ].forEach(function (task) {
        grunt.loadNpmTasks(task);
    });

    grunt.initConfig({
        cafemocha: {
            all: { src: 'qa/tests-*.js', options: { ui: 'tdd' }, }
        },
        jshint: {
            app: ['medowlark.js', 'publick/js/**/*.js', 'lib/**/*.js'],
            qa: ['Gruntfile.js', 'publick/qa/**/*.js', 'qa/**/*.js'],
        },
        exec: {
            linkchecker: {
                cmd: '"C:\\Program Files (x86)\\LinkChecker\\linkchecker.exe" http://localhost:3000' || 'linkchecker http://localhost:8080'
            }
        },
    });

    grunt.registerTask('default', ['cafemocha', 'jshint', 'exec']);

};