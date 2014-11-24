var express = require('express');
var mqsMQ = require('./lib/mqs-MQ');


var config = {
  mqsMq: {
    server: {
      host: 'localhost',
      port: 15672,
      login: 'guest',
      password: 'guest'
    },
    exchangeName: 'mqs-node-rabbitmq',
    queueName: 'mqs-node-rabbitmq-queue',
		replyQueueName: 'mqs-node-rabbitmq-queue'
  }
};

var port = process.env.PORT || 3000;
var app = express();
var server = app.listen(port);
console.log('Server listening at %s', port);

//Creating mqs-MQ Server
mqsMQ.init(config, function() {
	mqsMQ.listen(app);
});
