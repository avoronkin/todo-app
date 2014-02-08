var controllers = require('../controllers');
////
module.exports = {
    '/todos': {
        get: controllers.todo.list,
        post: controllers.todo.create,
        '/:id': {
            get: controllers.todo.read,
            delete: controllers.todo.delete,
            put: controllers.todo.update
        },
    }
};
