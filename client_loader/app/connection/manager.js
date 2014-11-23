define(['app/connection/factory'], function (connectionFactory) {

	var manager = {
		connections: [],
		addConnection: function addConnection (connection) {
			console.log('011');
			//recieved an offer, then accept it
			connection.on({type: 'offerDescription'}, function (data) {
				connectionFactory.create('webrtc', connection, data.fromId, data.data);
			});

			this.connections.push(connection);
		}
	}

	return manager;
});