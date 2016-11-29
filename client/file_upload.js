var express	= require("express");
var multer = require('multer');
var fs = require('fs');
var client = require("./client.js");
var app	= express();
var functionName;
module.exports.args = [];

var storage	=	multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
});
module.exports.upload = multer({ storage : storage}).single('function_file');

module.exports.readLocalFile = function readLocalFile(name, callback) {
	var filePath = "./uploads/" + name;
	fs.readFile(filePath, 'utf-8', function(err, data) {
		if (err) throw err;

		data = parseData(data);

		// Save modified file
		fs.writeFile(filePath, data, 'utf-8', function (err) {
			if (err) callback("ERROR: " + err);
			callback(null);
		});
	});
}

function parseData(data) {
	functionName = "";
	args = [];

	// We have to have function exported
	if (!data.startsWith("module.exports"))
		data = "module.exports.function_to_calculate = " + data;

	var regex = /function (\w+)\((.*?)\)/g;
	var match = regex.exec(data);
	functionName = match[1];
	if (match[2] != "")
		args = match[2].split(",");

	return data;
}