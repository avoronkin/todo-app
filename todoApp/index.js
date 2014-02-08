var connect = require('connect');
var routes = require('./routes');
var Router = require('director').http.Router;
var render = require('connect-render');

router = new Router(routes);
router.parse = function () {};
router.param('id', /(\w+)/);

var todoApp = connect()
// .use(connect.logger('dev'))
// .use(connect.json())
.use(render({
    root: __dirname + '/views',
    layout: 'layout.html',
    cache: false
}))
    .use(function (req, res, next) {
        router.dispatch(req, res, function (err) {
            if (err === undefined || err) next();
        });
    });

module.exports = todoApp;
