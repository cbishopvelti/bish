define([
	'vendor/lodash/lodash'
], function (_) {
	var provider = function () {
		var id = _.uniqueId();
		return {
			id: id
		};
	}

	return provider;
});