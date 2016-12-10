process.env.SERVER_HOSTNAME = "localhost";
var assert = require('assert');
var chai = require('chai');
var should = chai.should;
var expect = chai.expect;
var assert = chai.assert;
var http = require('http');
var express	= require("express");
var app	= express();

// To test
var fileUpload = require("../file_upload.js");
var client = require("../client.js");
var clientAPI = require("../client_api.js");
var testFunction = require("./test_function.js");

describe('Client', function() {
	describe('File upload', function() {

		it('should correctly download file from disk', function(done) {
			fileUpload.readLocalFile("../test.js", done);
		});

		it('should correctly parse data', function() {
			var data = "function test(arg1, arg2) {\
							return \"test\";\
						}";

			var result = fileUpload.parseData(data);
			assert.isTrue(result.startsWith("module.exports.function_to_calculate = "));
			assert.lengthOf(args, 2);
			assert.equal(functionName, "test");
		});

	});

	describe('Contact with the server', function() {
		
		it('should send correct data to server and get the response', function(done) {
    		this.timeout(15000);
			setTimeout(done, 15000);

			var args = ['foo', 'bar'];

			// Mock server
			app.post('', function(req,res){
    			var body = [];
				req.on('data', function(chunk) {
			        body.push(chunk);
			    }).on('end', function() {
			        try {
			            const json = Buffer.concat(body).toString();
			            const obj = JSON.parse(json);

			            // Check if correct data was sent
			            assert.equal(obj.args.length, args.length);
			            assert.equal(obj.args[0], args[0]);
			            assert.equal(obj.args[1], args[1]);
			            assert.equal(obj.code, testFunction.function_to_calculate.toString());

			            res.writeHead(200);
			            res.end("foobar");
			        } catch (e) {
			            console.error("Error while handling request: ", e);
			            res.writeHead(400);
			            res.end("ERR");
			        }
			    });
			});

			app.listen(8080, function() {
				console.log("Mock server on localhost:8080")
			});

			client.executeFunctionOnServer("./test/test_function.js", args, function(err, body) {
				// Check if we got response
				assert.isNull(err);
				assert.equal(body, "foobar");
		    	done();
			});
		});

	});

	describe('API', function() {
		
		it('should listen on correct port at the beginning', function() {
		    http.get('http://localhost:3000', function (res) {
		      assert.equal(200, res.statusCode);
		      done();
		    });
		});

	});
});