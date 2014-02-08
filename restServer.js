var connect = require('connect');
var restServerRoutingTable = require('./routes/apiRoutingTable');
var Router = require('director').http.Router;

var router = new Router();
router.parse = function () {};
router.param('id', /(\w+)/);
router.mount(restServerRoutingTable);

var restServer = connect()
    // .use(connect.logger('dev'))
    .use(connect.json())
    .use(function (req, res, next) {
        router.dispatch(req, res, function (err) {
            if (err === undefined || err) next();
        });
    });

module.exports = restServer;
