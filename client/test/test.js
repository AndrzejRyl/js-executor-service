process.env.CONFIG_PATH = './aws_config/example_config.json';
process.env.AWS_CONFIG_PATH = 'aws_config/example_aws_config.json';
const chai = require('chai');
const http = require("http");
const should = chai.should;
const expect = chai.expect;
const assert = chai.assert;

// To test
const fileUpload = require("../file_upload.js");
const client = require("../client.js");
const clientAPI = require("../client_api.js");
const testFunction = require("./test_function.js");

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
		
		it('should send correct data to server', function() {
			var args = ['foo', 'bar'];
			var filePath = "./test/test_function.js";
			var file = require("./test_function.js");

			var req = JSON.parse(client.getRequestBody(filePath, args));
			assert.equal(req.args.length, args.length);
			assert.equal(req.args[0], args[0]);
			assert.equal(req.args[1], args[1]);
			assert.equal(req.code, file.function_to_calculate.toString());
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