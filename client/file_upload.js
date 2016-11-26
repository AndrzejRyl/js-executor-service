var express	= require("express");
var multer = require('multer');
var fs = require('fs');
var client = require("./client.js");
var app	= express();
var functionName;
var args = [];
var fileName;

var storage	=	multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
});
var upload = multer({ storage : storage}).single('function_file');

module.exports.start = function start() {
	// ===================Routing=========================

	// Get main page
	app.get('/',function(req,res){
		res.sendFile(__dirname + "/index.html");
	});

	// Parse file with js function
	app.post('', function(req,res){
		upload(req,res,function(err) {
			console.log("Upload!");
			if(err) {
				return res.end("Error uploading file.");
			}

			fileName = req.file.filename;
			readLocalFile(req.file.filename, 
				function(err, body) {
					console.log("Read local file return!");
					if (err)
						res.end("{\"result\":\"errorerrorerror\"}");

					res.end("{\"result\":" + JSON.stringify(args) + "}");
				});
		});
	});

	// Send function along with arguments to the server and return response
	app.post('/execute', function(req, res) {
		client.executeFunctionOnServer("./uploads/" + fileName, req.args, function(err, body) {
			if (err)
				res.end("{\"result\":\"errorerrorerror\"}");
			else
				res.end("{\"result\":\"" + body + "\"}");

		});
	});

	app.listen(3000,function(){
		console.log("Working on port 3000");
	});
}

function readLocalFile(name, callback) {
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