// var controllers = require('../controllers'); 
var api = require('../../api');

module.exports = {
    '/': {
        get: function () {
            var self = this;

            api.todo.list().then(function (todos) {
                todos = todos.map(function (todo) {
                    return todo.toJSON();
                });

                self.res.render('index.html', {
                    current: null,
                    todos: todos
                });
            });
        },
        post: function () {
            var data = this.req.body;
            var self = this;
            // console.log('data', data);
            api.todo.create(data)
            // .fail(function (error) {
            //     console.log('fail', arguments);
            // })
            .fin(function () {
                self.res.redirect('/');
            });
        },
        '/delete/:id': {
            post: function (id) {
                var self = this;

                api.todo.delete(id).fin(function () {
                    self.res.redirect('/');
                });
            }
        },
        '/edit/:id': {
            get: function (id) {
                var self = this;

                api.todo.list().then(function (todos) {
                    todos = todos.map(function (todo) {
                        return todo.toJSON();
                    });

                    self.res.render('index.html', {
                        current: id,
                        todos: todos
                    });
                });
            },
        },
        '/update/:id': {
            post: function (id) {
                var self = this;
                var data = this.req.body;
                console.log('update', data);

                api.todo.update(id, data).fin(function () {
                    self.res.redirect('/');
                });

            }
        },
        '/complete/:id': {
            post: function (id) {
                var self = this;

                api.todo.update(id, {completed: true}).fin(function () {
                    self.res.redirect('/');
                });

            }
        },
        '/uncomplete/:id': {
            post: function (id) {
                var self = this;

                api.todo.update(id, {completed: false}).fin(function () {
                    self.res.redirect('/');
                });

            }
        }



    }
};
