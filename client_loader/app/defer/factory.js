define([], function () {

	var defer = function () {
		var newResolve,
			newReject;
		var outPromise = new Promise(function (resolve, reject) {
			newResolve = resolve;
			newReject = reject;
		});

		outPromise.resolve = newResolve;
		outPromise.reject = newReject;

		return outPromise;
	};

	return defer;
});