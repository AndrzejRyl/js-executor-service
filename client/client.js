var request = require('request');
var fs = require('fs');
var uploadCLient = require("./file_upload.js");

uploadCLient.start();

function readLocalFile(localPath) {
	// Modify file exporting function that is there. We will be able to use it here than
	fs.readFile(localPath, 'utf-8', function(err, data) {
		if (err) throw err;

		if (!data.startsWith("module.exports"))
			data = "module.exports.function_to_calculate = " + data;

		fs.writeFile(localPath, data, 'utf-8', function (err) {
			if (err) throw err;
			executeReadFunction();
		});
	});
}

function executeReadFunction() {
	var file = require(filePath);

	request({
		url: "http://localhost:8080",
		method: "POST",
		body: file.function_to_calculate.toString()
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
		} else {
			console.log("ERROR: " + error);
		}
	});
}