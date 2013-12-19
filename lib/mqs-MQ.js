var rabbitMQ = require("./rabbitMQ")
var me = this;

exports.init = function(config, callback) {
	console.log('mqs-MQ init...');
	me.config = config;
	rabbitMQ.init(config.mqsMq, function(){
		console.log("Connected to RabbitMQ.....");
	});
	callback && callback();
};


exports.listen = function(server) {
	console.log('mqs-MQ listen...');
	me.server = server;

	//Heartbeat service
	me.server.get('/api/heartbeat', function(req, res) {
		res.json("MQS Heartbeat Datetime" + new Date());
	});
	//authenticate user
	me.server.post('/message/user', function(req, res) {
		console.log("request body");
		console.log(req.body);
		res.json(req.body);
	});
	//listen ends//
};