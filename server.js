var connect = require('connect');
var http = require('http');
// var config = require('./config');
var restServer = require('./restServer');
var app = connect();

app.use('/api', restServer);

var server = http.createServer(app);

exports.listen = function () {
    server.listen.apply(server, arguments);
};

exports.close = function (callback) {
    server.close(callback);
};
