var connect = require('connect');
var routes = require('./routes');
var Router = require('director').http.Router;

var router = new Router(routes);
router.parse = function () {};
router.param('id', /(\w+)/);
// router.mount(routingTable);

var restApp = connect()
// .use(connect.logger('dev'))
    .use(connect.query())
    .use(connect.static(__dirname + '/console'))
    .use(connect.json())
    .use(function (req, res, next) {
        router.dispatch(req, res, function (err) {
            if (err === undefined || err) next();
        });
    });

module.exports = restApp;
