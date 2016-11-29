var request = require('request');
var api = require("./client_api.js");

// Listen for posts/gets
api.start();

module.exports.executeFunctionOnServer = function executeFunctionOnServer(filePath, arguments, callback) {
	var file = require(filePath);
	console.log("Args sent to server:" + arguments);
	console.log("JSON to server: " +  JSON.stringify({
			code:file.function_to_calculate.toString(),
			args: arguments}));

	request({
		url: "http://localhost:8080",
		method: "POST",
		body: JSON.stringify({
			code:file.function_to_calculate.toString(),
			args: arguments})
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(null, body);
		} else {
			callback("ERROR: " + error);
		}
	});
}