var util = require("util"),
  uuid = require('uuid'),
  rabbitMQ = require('./rabbitMQ');

var me = this;

exports.init = function(config, callback) {
  console.log('mqs-MQ init...');
  me.config = config;
  rabbitMQ.init(config.mqsMq, function() {

    //create a reply-queue
    rabbitMQ.queue(me.config.mqsMq.replyQueueName);

    //subscribe for reply-queue
    rabbitMQ.subscribe(me.config.mqsMq.replyQueueName, function(message) {
      console.log('REPLY-QUEUE subscribed: ' + me.config.mqsMq.replyQueueName);
      me.routeResponseCallbacks[message.id](message);
    });

    callback && callback();
  });
};

exports.listen = function(server) {
  console.log('mqs-MQ listen...');
  me.server = server;
  me.routeResponseCallbacks = {};

  me.server.all('*', function(req, res) {
    var message = {};
    var id = uuid.v4();

    try {
      // node has a built-in timeout - change it to not timeout
      res.connection.setTimeout(0);
    } catch (e) {
      logger.warn(e, "FAIL TO SET TIMEOUT ON REQUEST");
    }

    addCallback(id, res);

    var msg = {
      'id': id,
      'routingKey': 'REQUEST',
      'type': req.method,
      'url': req.url,
      'routePath': req._parsedUrl.pathname,
      'query': req.query,
      'params': req.params,
      'payload': {}
    };

    if (req.method == 'GET') {
      publishMessage(msg);
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
          msg.payload = payload;
          publishMessage(msg);
        }
      });
    }
  });
}

var addCallback = function(id, res) {
  console.log("router addCallback: id = " + id);
  me.routeResponseCallbacks[id] = function(message) {
    console.log("REPLY-QUEUE payload: " + util.inspect(message));
    message.routingKey = 'RESPONSE';
    message.data = {};
    res.json(message);
    delete me.routeResponseCallbacks[id];
  };
};

var publishMessage = function(msg) {
  rabbitMQ.publish(me.config.mqsMq.queueName, msg);
}
