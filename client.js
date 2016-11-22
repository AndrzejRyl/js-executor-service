var request = require('request');

var method = test.toString();

request({
    url: "http://localhost:8080",
    method: "POST",
    body: method
}, function (error, response, body) {
	if (!error && response.statusCode == 200) {
    	console.log(body);
  	} else {
  		console.log("ERROR: " + error);
  	}
});

function test() {
	return "Test";
}