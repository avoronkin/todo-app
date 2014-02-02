var Todo = require('../models/todo');
var returnJson = require('../utils/returnJson');

module.exports = {
    create: function () {
        var self = this;
        var data = this.req.body;
        var todo = new Todo();
        todo.set(data);

        todo.save(function (err, t) {
            returnJson.bind(self)(todo);
        });
    },

    read: function (id) {
        var self = this;

        Todo.find(id, function (err, todo) {
            returnJson.bind(self)(todo);
        });
    },

    update: function (id) {
        var self = this;
        var data = this.req.body;

        Todo.find(id, function (err, todo) {
            todo.set(data);
            todo.save(function (err, t) {
                returnJson.bind(self)(t);
            });
        });
    },

    delete: function (id) {
        var self = this;

        Todo.find(id, function (err, todo) {
            todo.remove(function (err, t) {
                returnJson.bind(self)(t);
            });

        });
    },

    list: function () {
        var self = this;

        Todo.all(function (err, todos) {
            returnJson.bind(self)(todos);
        });
    },

};
