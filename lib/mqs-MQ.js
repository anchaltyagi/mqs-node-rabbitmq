var me = this;

exports.init = function(config, callback) {
	console.log('rcg-static init()');
	me.config = config;
	callback && callback();
};


exports.listen = function(server) {
	console.log('mqs-MQ listen...');
	me.server = server;

	//listen ends//
};