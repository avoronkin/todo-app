var modella = require('modella');
var config = require('../config');
var mongo = require('modella-mongo')(config.mongo.host + '/' + config.mongo.db);

var Todo = modella('todo');

Todo.use('server', mongo);

Todo.attr('_id')
    .attr('title')
    .attr('completed');

module.exports = Todo;
