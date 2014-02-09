var Todo = require('../models/todo');
var Q = require('q');

module.exports = {
    create: function (json) {
        var deferred = Q.defer();
        var todo = new Todo();

        todo.set(json).save(function (error) {
            if (error) {
                deferred.reject(new Error(error));
            } else {
                deferred.resolve(todo);
            }
        });

        return deferred.promise;
    },

    read: function (id) {
        var deferred = Q.defer();

        Todo.find(id, function (error, todo) {
            if (error) {
                deferred.reject(new Error(error));
            }
            if (!todo) {
                deferred.reject(new Error('Not found'));
            } else {
                deferred.resolve(todo);
            }
        });

        return deferred.promise;
    },

    update: function (id, json) {
        var deferred = Q.defer();

        this.read(id).then(function (todo) {

            if (todo) {
                todo.set(json);
                todo.save(function (error) {
                    if (error) {
                        deferred.reject(new Error(error));
                    } else {
                        deferred.resolve(todo);
                    }
                });
            } else {
                deferred.reject(new Error('todo not found'));
            }

        }).fail(function (error) {
            deferred.reject(new Error(error));
        });

        return deferred.promise;
    },

    delete: function (id) {
        var deferred = Q.defer();

        this.read(id).then(function (todo) {
            if (todo) {
                todo.remove(function (error) {
                    if (error) {
                        deferred.reject(new Error(error));
                    } else {
                        deferred.resolve();
                    }
                });
            } else {
                deferred.reject(new Error('todo not found'));
            }

        }).fail(function (error) {
            deferred.reject(new Error(error));
        });

        return deferred.promise;
    },

    list: function (offset, limit) {
        var deferred = Q.defer();

        Todo.all(function (error, todos) {
            if (error) {
                deferred.reject(new Error(error));
            } else {
                deferred.resolve(todos);
            }
        });

        return deferred.promise;
    }
};
