var connect = require('connect');
var http = require('http');
var mainApp = connect();
var restApp = require('./restApp');
var todoApp = require('./todoApp');

mainApp.use('/', todoApp);
mainApp.use('/api', restApp);

var server = http.createServer(mainApp);

exports.listen = function () {
    server.listen.apply(server, arguments);
};

exports.close = function (callback) {
    server.close(callback);
};
