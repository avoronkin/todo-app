var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;
var should = chai.should();

var mongo = require('mongoskin');
var config = require('../../config');
var db = mongo.db(config.mongo.host + '/' + config.mongo.db, {
    safe: true
});

var api = require('../../api');
var todosFixture = [{
    _id: '00000000000000000000001',
    title: 'test1',
    completed: false
}, {
    _id: '00000000000000000000002',
    title: 'test2',
    completed: false
}];


describe('API', function () {
    describe('todo', function () {
        db.bind('todo');

        beforeEach(function (done) {
            db.todo.drop().insert(todosFixture, done);
        });

        describe('create(json)', function () {
            it('shold create document in todo collection', function () {
                return api.todo.create({
                    title: 'test title'
                }).then(function (todo) {
                    db.todo.findById(todo.primary(), function (err, result) {
                        return result.title.should.be.equal('test title');
                    });
                });
            });
        });

        describe('read(id)', function () {
            it('should return todo by id', function () {
                return api.todo.read('00000000000000000000001')
                    .then(function (todo) {
                        return todo.get('title').should.be.equal('test1');
                    });
            });

            it('should throw  error for a non-existent todo', function () {
                return api.todo.read('00000000000000000000009').should.be.rejectedWith(Error);
            });

        });

        describe('update(id, json)', function () {
            it('should update todo', function () {
                return api.todo.update('00000000000000000000001', {
                    title: 'updated title'
                }).then(function (todo) {
                    db.todo.findById(todo.primary(), function (err, result) {
                        return result.title.should.be.equal('updated title');
                    });
                });
            });

            it('should throw error for not-existent todo', function () {
                return api.todo.update('00000000000000000000007', {
                    title: 'updated title'
                }).should.be.rejectedWith(Error);
            });

        });

        describe('delete(id)', function () {
            it('should delete todo', function () {
                var id = '00000000000000000000001';

                return api.todo.delete(id).then(function (error) {
                    db.todo.findById(id, function (err, result) {
                        return expect(result).be.equal(null);
                    });
                });
            });

            it('should throw error for not-existent todo', function () {
                var id = '00000000000000000000005';

                return api.todo.delete(id).should.be.rejectedWith(Error);
            });

        });
    });


});
