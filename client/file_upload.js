var express	= require("express");
var multer = require('multer');
var client = require("./client.js");
var app	= express();

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

	// Post file with js function
	app.post('',function(req,res){
		upload(req,res,function(err) {
			if(err) {
				return res.end("Error uploading file.");
			}
			
			client.readLocalFile(req.file.filename, 
				function(err, body) {
					if (err) {
						res.end("{\"result\":\"errorerrorerror\"}");
					} else {
						res.end("{\"result\":\"" + body + "\"}");
					}
				});
		});
	});

	app.listen(3000,function(){
		console.log("Working on port 3000");
	});
}