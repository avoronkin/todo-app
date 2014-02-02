
var connect = require('connect');
var http = require('http');
var apiRoutingTable = require('./routes/apiRoutingTable');
var Router = require('director').http.Router;
var config = require('./config');

var router = new Router();
router.parse = function () {};
router.param('todoId', /(\w+)/);
router.mount(apiRoutingTable, 'api');

var app = connect()
    // .use(connect.logger('dev'))
    .use(connect.json())
    .use(function (req, res, next) {
        router.dispatch(req, res, function (err) {
            if (err === undefined || err) next();
        });
    });

var server = http.createServer(app);

exports.listen = function () {
    server.listen.apply(server, arguments);
};

exports.close = function (callback) {
    server.close(callback);
};
