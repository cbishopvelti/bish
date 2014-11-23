define([
	'app/connection_webrtc/factory'
], function (webrtcFactory) {

	var factory = function () {
		return {
			create: function (type, channel, toId, offerDescription) {

				if(type === 'webrtc' && offerDescription) {
					webrtcFactory.createOffer(channel, toId, offerDescription);
				}

			}
		}
	}

	return factory;
});
