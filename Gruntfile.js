module.exports = function (grunt) {

  require("time-grunt")(grunt);
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    watch: {
      browserify: {
        files: "lib/**/*.js",
        tasks: "browserify"
      },
      livereload: {
        files: "public/**/*",
        options: {
          livereload: 35729
        }
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: "0.0.0.0"
      },
      livereload: {
        options: {
          base: "public",
          livereload: true
        }
      }
    },
    browserify: {
      main: {
        src: "lib/main.js",
        dest: "public/js/main.js"
      }
    }
  });

  grunt.registerTask("dev", ["browserify", "connect", "watch"]);

};
