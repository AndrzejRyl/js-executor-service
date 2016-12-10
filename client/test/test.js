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
	});
});