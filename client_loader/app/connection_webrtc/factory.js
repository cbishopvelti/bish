define([
	'vendor/lodash/lodash', 
	'app/connection/provider'
], function (_, connectionProvider) {

	var factory = function () {
		return {
			createClient: function (socket, toId) { //create offer
				return this.create(socket, null, toId);
			},

			createServer: function (socket, offerDescription, fromId) { //create answer
				return this.create(socket, offerDescription, fromId)
			},
			/*
			if offer is set, then we are the server
			*/
			create: function (socket, offerDescription, toId) {
				var model,
					webRtcConnection,
					createAnswerOfferCallback,
					myId = connectionProvider.id;

				webRtcConnection = new webkitRTCPeerConnection(null, {optional: [{RtpDataChannels: true}]}); // get this abstracted


				if(offerDescription) {
					webRtcConnection.setRemoteDescription(new RTCSessionDescription(offerDescription));
				}

				webRtcConnection.onicecandidate = function (event) {
					console.log('onicecandidate');
					socket.send(JSON.stringify({
						type: "icecandidate",
						toId: toId,
						from: myId,
						data: event.candidate 
					}))
				};

				webRtcConnection.ondatachannel = function (event) {
					console.log('ondatachannel')
					var channel = event.channel;
				};

				createAnswerOfferCallback = function (description) {
					webRtcConnection.setLocalDescription(description);
					socket.send({
						type: 'description',
						toId: toId,
						fromId: myId,
						data: description
					});
				};

				if (offerDescription) {
					// createAnswerOfferCallback(offerDescription);
					webRtcConnection.createAnswer(
						webRtcConnection.remoteDescription,
						createAnswerOfferCallback
					);
				} else {
					webRtcConnection.createOffer(function () {
						webRtcConnection.setLocalDescription(description);
						socket.send(JSON.stringify({
							type: 'offerDescription',
							toId: toId,
							fromId: myId,
							data: description
						}));
					});
				}

				socket.on({type: 'description', toId: myId}, function (event) {
					var description = JSON.parse(event.data).data;
					webRtcConnection.setRemoteDescription(new RTCSessionDescription(description));
				});

				socket.on({type: 'icecandidate', toId: myId}, function (event) {
					var iceCandidate = JSON.parse(event.data).data;
					webRtcConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
				});

				model = {

				}

				return model;
			}
		}
	}

	return factory
});