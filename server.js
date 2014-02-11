var connect = require('connect');
var http = require('http');
var mainApp = connect();
var restApp = require('./restApp');
var todoApp = require('./todoApp');

mainApp.use('/api', restApp);
mainApp.use('/', todoApp);

var server = http.createServer(mainApp);

server.on('listening', function () {
    var address = server.address();
    console.log('Connect server listening on http://%s:%s', address.address, address.port);
});

server.on('close', function () {
    console.log('Connect server stoped');
});

exports.listen = function () {
    server.listen.apply(server, arguments);
};

exports.close = function (callback) {
    server.close(callback);
};
