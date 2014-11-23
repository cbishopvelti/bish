var http = require('http'),
	fs = require('fs'),
	WebSocketServer = require('websocket').server,
	_ = require('lodash');

var server = http.createServer(function (request, response) {
	var urlMatches,
		path;
	if(urlMatches = request.url.match(/^\/index.html?$/)) {
		path = './client_loader/index.html';
	} else if(urlMatches = request.url.match(/^\/client(.*)/)){

		path = './client_loader' + urlMatches[1];		
	}else if (urlMatches = request.url.match(/^\/vendor(.*)/)) {

		path = './node_modules' + urlMatches[1];
	} else {
		response.writeHead(404);
		response.end();
	}

	if(path) {
		fs.readFile(path, function (error, data) {
			var contentType;

			if(error) {
				console.log("error", error);
			}

			if(request.url.match(/\.html?$/)){
				contentType = "text/html";
			} else if (request.url.match(/\.js?$/)) {
				contentType = "text/javascript";
			}

			response.writeHead(200, {"Content-Type": contentType});
			response.end(data);
		});
	}

	// response.writeHead(200, {"Content-Type": "text/plain"});
	// response.end("Hello World\n");
});

server.listen(8000);

var webSocketServer = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false
});

var addresses = [];

webSocketServer.on('request', function(request) { 
	var connection = request.accept('bish', request.origin);
		
	connection.on('message', function (message) {
		console.log('message', message);
		var messageJson = JSON.parse(message.utf8Data),
			outMessage,
			outMessageString;

		if(messageJson.request === 'getSetAddresses'){
			var id = _.uniqueId();
			connection.id = id;
			outMessage = JSON.stringify({
				'id': id,
				'requestId': message.requestId,
				'addresses': addresses
			});
			addresses.push(id);
		} else {
			// send it back
			outMessage = {
				request: 'unknown',
				data: message.data
			};
		}

		outMessageString = JSON.stringify(outMessage);
		connection.sendUTF(outMessageString);
	});
	connection.on('close', function(reasonCode, description) {
		addresses = _.remove(addresses, connection.id);
		console.log('close', reasonCode, description);
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});