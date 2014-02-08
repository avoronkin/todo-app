var todo = require('../controllers/todo');
////
module.exports = {
    '/todos': {
        get: todo.list,
        post: todo.create,
        '/:id': {
            get: todo.read,
            delete: todo.delete,
            put: todo.update
        },
    }
};
