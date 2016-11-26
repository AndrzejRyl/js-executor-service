var request = require('request');
var fs = require('fs');
var uploadCLient = require("./file_upload.js");

// Listen for file uploads
uploadCLient.start();

module.exports.readLocalFile = function readLocalFile(name, callback) {
	var filePath = "./uploads/" + name;
	fs.readFile(filePath, 'utf-8', function(err, data) {
		if (err) throw err;

		data = parseData(data);

		// Save modified file
		fs.writeFile(filePath, data, 'utf-8', function (err) {
			if (err) throw err;
			executeFunctionOnServer(filePath, callback);
		});
	});
}

function executeFunctionOnServer(filePath, callback) {
	var file = require(filePath);

	request({
		url: "http://localhost:8080",
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

function parseData(data) {
	// We have to have function exported
	if (!data.startsWith("module.exports"))
		data = "module.exports.function_to_calculate = " + data;

	return data;
}