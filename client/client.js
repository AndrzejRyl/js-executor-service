var request = require('request');
var uploadCLient = require("./file_upload.js");

// Listen for file uploads
uploadCLient.start();

module.exports.executeFunctionOnServer = function executeFunctionOnServer(filePath, arguments, callback) {
	var file = require(filePath);
	console.log("Args sent to server:" + arguments);

	request({
		url: "http://192.168.99.100:12345",
		method: "POST",
		body: file.function_to_calculate.toString()
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(null, body);
		} else {
			callback("ERROR: " + error);
		}
	});
}