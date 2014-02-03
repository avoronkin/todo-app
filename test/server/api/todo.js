var expect = require('chai').expect;
var request = require('supertest');
var mongo = require('mongoskin');
var config = require('../../../config');
var db = mongo.db(config.mongo.host + '/' + config.mongo.db, {
    safe: true
});
var apiUrl = 'http://' + config.http.host + ':' + config.http.port + '/api/';
var server = require('../../../server');

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
    before(function (done) {
        server.listen(config.http.port, done);
    });

    after(function (done) {
        server.close(done);
    });

    describe('todo', function () {
        var todosUrl = 'todos';
        db.bind('todo');

        beforeEach(function (done) {
            db.todo.drop().insert(todosFixture, done);
        });

        it('create', function (done) {
            request(apiUrl)
                .post(todosUrl)
                .send({
                    title: 'test title',
                    completed: false
                })
                .end(function (err, res) {

                    db.todo.findOne({
                        title: 'test title'
                    }, function (err, todo) {

                        expect(err).to.be.equal(null);
                        expect(todo).to.exist;
                        done();
                    });
                });
        });

        it('read', function (done) {
            request(apiUrl)
                .get(todosUrl + '/00000000000000000000001')
                .end(function (err, res) {
                    var todo = res.body;

                    expect(err).to.be.equal(null);
                    expect(todo.title).to.be.equal('test1');
                    expect(todo.completed).to.be.equal(false);
                    done();
                });
        });

        it('update', function (done) {
            request(apiUrl)
                .put(todosUrl + '/00000000000000000000001')
                .send({
                    title: 'updated title',
                    completed: true
                })
                .end(function (err, res) {

                    db.todo.findOne({
                        _id: '00000000000000000000001'
                    }, function (err, todo) {

                        expect(err).to.be.equal(null);
                        expect(todo.title).to.be.equal('updated title');
                        expect(todo.completed).to.be.equal(true);
                        done();
                    });
                });
        });

        it('delete', function (done) {
            request(apiUrl)
                .del(todosUrl + '/00000000000000000000002')
                .end(function (err, res) {

                    db.todo.findOne({
                        _id: '00000000000000000000002'
                    }, function (err, todo) {

                        expect(err).to.be.equal(null);
                        expect(todo).to.be.equal(null);
                        done();
                    });
                });
        });


        it('read list', function (done) {
            request(apiUrl)
                .get(todosUrl)
                .end(function (err, res) {

                    var todos = res.body;
                    expect(todos).to.be.deep.equal(todosFixture);
                    expect(err).to.be.equal(null);
                    done();
                });
        });
    });

});
