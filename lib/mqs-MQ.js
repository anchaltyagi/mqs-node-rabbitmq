var util = require("util"),
	uuid = require('uuid');

var me = this;

exports.init = function(config, callback) {
	console.log('mqs-MQ init...');
	me.config = config;
	callback && callback();
};


exports.listen = function(server) {
	console.log('mqs-MQ listen...');
	me.server = server;
	me.routeResponseCallbacks = {};

	//Heartbeat service
	me.server.get('/api/heartbeat', function(req, res) {
		res.json("MQS Heartbeat Datetime" + new Date());
	});

	me.server.all('*', function(req, res) {
		var message = {};
		var id = uuid.v4();

		//console.log('**********************************');
		//console.log(req);
		//console.log('**********************************');
		console.log('id:' + id);
		console.log('url:' + req.url);
		console.log('routePath:' + req._parsedUrl.pathname);
		console.log('method: ' + req.method);
		console.log('query: ' + req.query);
		console.log('params: ' + req.params);

		addCallback(id, res);

		if (req.method == 'GET') {
			console.log('GET method');
		} else {
			var data = '';
			req.on("data", function(chunk) {
				data += chunk;
				if (data.length > 1e6) {
					// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
					request.connection.destroy();
				}
			});

			req.on("end", function() {
				if (req.method == 'DELETE' || req.method == 'PUT' || req.method == "POST") {
					var payload = '';
					try {
						payload = JSON.parse(data);
					} catch (e) {
						console.log(e);
					}

					if (data.length == 0) {
						console.log("PUB-QUEUE payload: " + util.inspect(payload));
						//me.publishMessage(id, routeObj, req);
						me.routeResponseCallbacks[id](payload);
					} else {
						console.log("PUB-QUEUE payload: " + util.inspect(payload));
						//me.publishMessage(id, routeObj, req, payload);
						me.routeResponseCallbacks[id](payload);
					}
				}				
			});
		}
	});


	addCallback = function(id, res) {
		console.log("router addCallback: id = " + id);

		me.routeResponseCallbacks[id] = function(message) {
			console.log("REPLY-QUEUE payload: " + util.inspect(message));
			res.json(message);			
			delete me.routeResponseCallbacks[id];
		};
	};
}