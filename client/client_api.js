var express	= require("express");
var bodyParser = require("body-parser");
var uploadClient = require("./file_upload.js");
var client = require("./client.js");
var fileName;

var app	= express();

module.exports.start = function start() {
	app.use(bodyParser.json());

	// Routing 
	// Get main page
	app.get('/',function(req,res){
		res.sendFile(__dirname + "/index.html");
	});

	// Send function along with arguments to the server and return response
	app.post('/execute', function(req, res) {
		client.executeFunctionOnServer("./uploads/" + fileName, req.body.args, function(err, body) {
			if (err)
				res.end("{\"result\":\"Something went wrong on the server.\"}");
			else
				res.end("{\"result\":" + body + "}");

		});
	});

	// Parse file with js function to get list of args
	app.post('', function(req,res){
		uploadClient.upload(req,res,function(err) {
			if(err) {
				return res.end("Error uploading file.");
			}

			fileName = req.file.filename;
			uploadClient.readLocalFile(req.file.filename, 
				function(err, body) {
					if (err)
						res.end("{\"result\":\"Something went wrong while parsing file you provided.\"}");

					res.end("{\"result\":" + JSON.stringify(args) + "}");
				});
		});
	});

	app.listen(3000,function(){
		console.log("Working on port 3000");
	});


}
