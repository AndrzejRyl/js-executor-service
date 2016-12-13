const api = require("./client_api.js");
const config = require('../config/config.json');
const AWS = require('aws-sdk');
var msgId;

// Listen for posts/gets
api.start();

// Request queue
AWS.config.loadFromPath('../config/aws_config.json');
var requestsQueue = new AWS.SQS({
    apiVersion: config.SQS_API_VERSION,
    params: {
        QueueUrl: config.REQUESTS_SQS_QUEUE_URL
    }
});

// Response queue
var responsesQueue = new AWS.SQS({
    apiVersion: config.SQS_API_VERSION,
    params: {
        QueueUrl: config.RESPONSES_SQS_QUEUE_URL
    }
});

module.exports.executeFunctionOnServer = function executeFunctionOnServer(filePath, arguments, callback) {
	var file = require(filePath);
	requestsQueue.sendMessage({
        MessageBody: JSON.stringify({
			code:file.function_to_calculate.toString(),
			args: arguments})
    }, function(err, data) {
    	callback(err);
        msgId = data.MessageId;
    });


    setTimeout(function() {
        // then
        checkResponse(msgId, callback);
    }, 5000);
}

function checkResponse(msgId, callback) {
    responsesQueue.receiveMessage({
        MessageAttributeNames: [
            "All"
        ]
    }, function(err, data) {
        var msg = data.Messages[0];
        if (msg.MessageAttributes.requestId.StringValue == msgId) {
            responsesQueue.deleteMessage({
                ReceiptHandle: msg.ReceiptHandle
            }, function(err, data) {
                if (err) callback(err);
                callback(null, msg);
            });
        } else {
            checkResponse(msgId, callback);
        }
    });
}