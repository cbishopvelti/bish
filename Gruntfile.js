module.exports = function (grunt) {
	grunt.initConfig({
		server: {
			port: 8000,
			base: './node'
		},
		nodemon: {
			dev: {
				script: './node/index.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-nodemon');

	grunt.registerTask('default', 'default', 'nodemon');
};
