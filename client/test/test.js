var assert = require('assert');
var chai = require('chai');
var should = chai.should;
var expect = chai.expect;
var assert = chai.assert;

// To test
var fileUpload = require("../file_upload.js");

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
});