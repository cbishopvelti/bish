define([
	'vendor/lodash/lodash',
	'app/defer/factory'
], function (_, Defer) {

	var webSocket,
		connect;

	connect = function (model, promise) {
		model.socket = new WebSocket('ws://localhost:8000/', ['bish']);
		model.socket.onopen = function () {

			promise.resolve(model);
			// model.socket.send('please do something');
			console.log('webSocket.onopen');
		};
		model.socket.onmessage = function (event) {
			console.log('onmessage', event.data);
			var data = JSON.parse(event.data),
				eventsToFire;

			eventsToFire = _.filter(model.listeners, {conditions: data})
			_.each(eventsToFire, function (item) {
				item.callback(data);
			});
		};
		model.on = function (conditions, callback) {
			model.listeners.push({
				conditions: conditions,
				callback: callback
			});
		};
		model.socket.onclose = function (event, b, c) {
			promise.reject();
			console.log('webSocket.onclose', event, b, c);
		};
		model.send = function (message) {
			var outMessage;
			if(_.isObject(message)){
				outMessage = JSON.stringify(message);
			}else{
				outMessage = message
			}
			model.socket.send(outMessage);
		};
		model.sendRecieve = function (message) {
			var outMessage, 
				promise = new Defer();
			if(_.isObject(message)) {
				message.requestId = _.uniqueId();
				outMessage = JSON.stringify(message);
			}
			//TODO: add timeout
			model.on({requetsId: message.requestId}, function (data) {
				promise.resolve(JSON.parse(data));
			});
			console.log('outMessage', outMessage);
			model.socket.send(outMessage);
			return promise;
		};

	};

	webSocket = {
		create: function () {
			var promise = new Defer(),
				model = {
					socket: null,
					listeners: []
				};

			connect(model, promise);
			return promise;
		}
	}

	return webSocket;
});