var server = require('./server');
var config = require('./config');

server.listen(config.http.port);
