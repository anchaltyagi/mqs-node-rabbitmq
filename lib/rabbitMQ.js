var self = this;
var amqp = require('amqp');

exports.init = function(mqsMqConfig, callback) {
  self.mqsMqConfig = mqsMqConfig;
  self.mq_connection = amqp.createConnection({
    host: 'localhost',
    port: 5672
  });

  self.mq_connection.on('ready', function() {
    callback(self);
  });

}

exports.publish = function(queue, message) {
  self.mq_connection.publish(queue, message);
}

exports.subscribe = function(queue, callback) {  
  self.mq_connection.queue(queue, function(q) {
		console.log('Message subscribed: ' + queue);
    q.subscribe(callback);
  });
}

exports.queue = function(queue, options) {
  self.mq_connection.queue(queue, options);
}

exports.exchange = function(exchange, options) {
  self.mq_connection.exchange(exchange, options);
}
