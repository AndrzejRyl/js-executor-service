const configPath = process.env.CONFIG_PATH || './aws_config/config.json';
const awsConfigPath = process.env.AWS_CONFIG_PATH || 'aws_config/aws_config.json';
const api = require("./client_api.js");
const config = require(configPath);
const AWS = require('aws-sdk');
var msgId;

// Listen for posts/gets
api.start();

// Request queue
AWS.config.loadFromPath(awsConfigPath);
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

module.exports.getRequestBody = function getRequestBody(filePath, arguments) {
    var file = require(filePath);
    return JSON.stringify({
            code:file.function_to_calculate.toString(),
            args: arguments});
}

module.exports.executeFunctionOnServer = function executeFunctionOnServer(filePath, arguments, callback) {
	requestsQueue.sendMessage({
        MessageBody: module.exports.getRequestBody(filePath, arguments)
    }, function(err, data) {
        if (err) callback(err);
        msgId = data.MessageId;

        checkResponse(msgId, callback);
    });
}

function checkResponse(msgId, callback) {
    responsesQueue.receiveMessage({
        MessageAttributeNames: [
            "All"
        ],
        WaitTimeSeconds: 20
    }, function(err, data) {
        if (err) callback(err);
        var msg = data.Messages[0];
        if (msg.MessageAttributes.requestId.StringValue == msgId) {
            responsesQueue.deleteMessage({
                ReceiptHandle: msg.ReceiptHandle
            }, function(err, data) {
                if (err) callback(err);
                callback(null, msg.Body);
            });
        } else {
            checkResponse(msgId, callback);
        }
    });
}