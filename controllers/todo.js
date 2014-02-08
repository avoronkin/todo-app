var Todo = require('../models/todo');
var returnResponse = require('../utils/returnJson');
var api = require('../api');

module.exports = {
    create: function () {
        var data = this.req.body;

        returnResponse.bind(this)(api.todo.create(data), 201);
    },

    read: function (id) {
        returnResponse.bind(this)(api.todo.read(id), 200);
    },

    update: function (id) {
        var data = this.req.body;

        returnResponse.bind(this)(api.todo.update(id, data), 200);
    },

    delete: function (id) {
        returnResponse.bind(this)(api.todo.delete(id), 204);
    },

    list: function () {
        var self = this;
        // Todo.all(function (err, todos) {
        //     returnJson.bind(self)(err, {
        //         data: todos
        //     });
        // });
    },

};
