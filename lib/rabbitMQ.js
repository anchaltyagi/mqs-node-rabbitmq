var self = this;
var amqp = require('amqp');

exports.init = function(config, callback) {
	self.config = config;
	self.mq_connection = amqp.createConnection({url: "amqp://guest:guest@localhost:5672"});
	self.mq_connection.on('ready', function() {
			console.log("Connected to RabbitMQ.....");
			callback(self);
		});
}

exports.onMessage = function(queue, callback) {
	var options = {
		"autoDelete": false,
		"exclusive": false,
		"durable": false
	};
	self.mq_connection.queue(queue, options, function(q) {
		q.bind('#');
		q.subscribe({}, callback);
	});
}

exports.publish = function(queue, message) {
	self.mq_connection.publish(queue, message);
}

exports.queue = function(queue, options, callback) {
	self.mq_connection.queue(queue, options, callback);
}

exports.exchange = function(exchange, options, callback) {
	self.mq_connection.exchange(exchange, options, callback);
}