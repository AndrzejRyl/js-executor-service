var express	= require("express");
var multer = require('multer');
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
	app.get('/',function(req,res){
		res.sendFile(__dirname + "/index.html");
	});

	app.post('',function(req,res){
		upload(req,res,function(err) {
			if(err) {
				return res.end("Error uploading file.");
			}

			var client = require("./client.js");
			client.readLocalFile(req.file.filename);
			res.end();
		});
	});

	app.listen(3000,function(){
		console.log("Working on port 3000");
	});
}