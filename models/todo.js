var modella = require('modella');
var config = require('../config');
var mongo = require('modella-mongo')(config.mongo.host + '/' + config.mongo.db);
var defaults = require('modella-defaults');
var validators = require('modella-validators');

var Todo = modella('todo');

Todo.use('server', mongo);
Todo.use(defaults);
Todo.use(validators);

Todo.attr('_id')
    .attr('title', {
        required: true,
        type: 'string'
    })
    .attr('completed', {
        default: false,
        type: 'boolean'
    });

module.exports = Todo;
