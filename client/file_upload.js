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

	app.post('/api/function_file',function(req,res){
		upload(req,res,function(err) {
			if(err) {
				return res.end("Error uploading file.");
			}
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Content-Type', 'text/plain');
			res.writeHead(200);
			res.end();
		});
	});

	app.listen(3000,function(){
		console.log("Working on port 3000");
	});
}