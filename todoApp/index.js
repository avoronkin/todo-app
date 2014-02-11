var connect = require('connect');
var routes = require('./routes');
var Router = require('director').http.Router;
var render = require('connect-render');
var redirect = require('connect-redirection');

router = new Router(routes);
router.parse = function () {};
router.param('id', /(\w+)/);

var todoApp = connect()
    .use(connect.urlencoded())
    // .use(connect.logger('dev'))
    .use(connect.static(__dirname + '/public'))
    .use(redirect())
    .use(render({
        root: __dirname + '/views',
        layout: 'layout.html',
        cache: false
    }))
    .use(function (req, res, next) {
        router.dispatch(req, res, function (err) {
            if (err) {
                res.render('404.html');
            } else {
                next();
            }
        });
    });

module.exports = todoApp;
