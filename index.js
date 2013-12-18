var express = require('express');
var	mqsMQ = require('./lib/mqs-MQ');


var config = {	
};

var port = process.env.PORT || 3000;
var app = express();
var server = app.listen(port);
console.log('Server listening at %s', port);

//Creating mqs-MQ Server
mqsMQ.init(config, function(){
	mqsMQ.listen(app);
});