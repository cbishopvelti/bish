requirejs.config({
	paths: {
		app: "/client/app",
		vendor: "/vendor"
	}
});

require(["app/main"], function (app) {
	console.log('Application Started');
});