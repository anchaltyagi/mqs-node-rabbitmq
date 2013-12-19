var chai = require("chai"),
	assert = chai.assert,
	expect = chai.expect,
	util = require("util"),
	restify = require('restify'),
	Promise = require("promise");

var HOST = "http://127.0.0.1:3000";

var client = restify.createJsonClient({
	url: HOST
});

var userObject = {
	"id": "",
	"sourceType": "CPM",
	"timerType": "datetime",
	"timerStartTime": "",
	"timerEndTime": "",
	"cronExpression": "",
	"callbackurl": "/tqs/testCallback",
	"data": {
		"test": "Test the url"
	},
	"createDateTime": "",
	"isProcessed": "",
	"processedDateTime": ""
};


describe('MQS Test', function() {
	describe('MQS Test case 1', function() {
		it('should post a request', function(done) {
			client.post("/message/user/45454?sort=true", userObject, function(err, req, res, obj) {
				if (err) throw (err);
				expect(res.statusCode).to.equal(200);
				//expect(obj.id).to.not.equal(null);
				//newId = obj.id;
				//console.log("Got an ID: " + newId);				
				done();
			});
		});
	});
});