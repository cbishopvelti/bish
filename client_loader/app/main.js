define([
	'vendor/lodash/lodash',
	'app/connection_websocket/modelFactory',
	'app/connection/manager',
	'app/connection/provider'
], function (_, websocketModelFactory, connectionManager, connectionProvider) {
	console.log('main', websocketModelFactory);

	var websocketModelFactoryBindings = {
		success: function (socket) {
			console.log('001.1', connectionManager);
			connectionManager.addConnection(socket);
			console.log('002');
			
			socket.sendRecieve({
				request: 'getSetAddresses'
			}).then(function (data) {
				console.log('in');
				connectionProvider.id = data.id; // id get assigned from the server
				if(data.length > 0){
					connectionFactory.create('webrtc', socket, _.first(data.addresses));
				}
			}, function () {
				console.log('getAddresses failed');
			});
		},
		failure: function () {
			console.log('websocketModelFactoryBindings failure');
		}
	}

	// connect to server, 
	websocketModelFactory.create()
		.then(
			websocketModelFactoryBindings.success,
			websocketModelFactoryBindings.failure
		);

	console.log('what');

	// recieve ppl to connect to

	// pass address

	//get the data

});