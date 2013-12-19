var self = this;
var amqp = require('amqp');

exports.init = function(config, callback) {
	self.mq_connection = amqp.createConnection({url: "amqp://guest:guest@localhost:5672"},
                        {defaultExchangeName: config.exchangeName});
	self.mq_connection.on('ready', function() {
			callback();
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

exports.exchange = function(name, options, callback) {
	self.mq_connection.exchange(name, options, callback);
}