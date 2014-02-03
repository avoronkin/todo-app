var Todo = require('../models/todo');
var returnJson = require('../utils/returnJson');

module.exports = {
    create: function () {
        var data = this.req.body;
        var todo = new Todo();

        todo.set(data).save(returnJson.bind(this));
    },

    read: function (id) {
        Todo.find(id, returnJson.bind(this));
    },

    update: function (id) {
        var self = this;
        var data = this.req.body;

        Todo.find(id, function (err, todo) {
            todo.set(data);
            todo.save(returnJson.bind(self));
        });
    },

    delete: function (id) {
        var self = this;

        Todo.find(id, function (err, todo) {
            todo.remove(returnJson.bind(self));
        });
    },

    list: function () {
        Todo.all(returnJson.bind(this));
    },

};
