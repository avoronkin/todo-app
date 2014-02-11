var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var request = require('supertest');
var mongo = require('mongoskin');
var config = require('../../../config');
var db = mongo.db(config.mongo.host + '/' + config.mongo.db, {
    safe: true
});
var apiUrl = 'http://' + config.http.host + ':' + config.http.port + '/api/';
var server = require('../../../server');

var todosFixture = require('../../fixtures/todo') 

describe('REST API', function () {
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
                    completed: false,
                    ups: 'ups'
                })
                .end(function (err, res) {

                    res.statusCode.should.be.equal(201);

                    db.todo.findOne({
                        title: 'test title'
                    }, function (err, todo) {

                        expect(err).to.be.equal(null);
                        expect(todo).to.exist;
                        expect(todo.ups).not.exist;
                        todo.completed.should.be.equal(false);
                        todo.title.should.be.equal('test title');
                        done();
                    });
                });
        });

        describe('read', function () {
            it('read', function (done) {
                var id = '00000000000000000000001';

                request(apiUrl)
                    .get(todosUrl + '/' + id)
                    .end(function (err, res) {
                        var todo = res.body;

                        expect(err).to.be.equal(null);
                        expect(todo.title).to.be.equal('test1');
                        expect(todo.completed).to.be.equal(false);
                        done();
                    });
            });

            it('should return 404 if resource not found', function(done){
                 request(apiUrl)
                    .get(todosUrl + '/qqwwertyuiop')
                    .end(function (err, res) {
                        var todo = res.body;

                        expect(err).to.be.equal(null);
                        res.statusCode.should.to.be.equal(404);
                        done();
                    });
            });
        });

        it('update', function (done) {
            var id = '00000000000000000000001';

            request(apiUrl)
                .put(todosUrl + '/' + id)
                .send({
                    title: 'updated title',
                    completed: true
                })
                .end(function (err, res) {

                    db.todo.findById(id, function (err, todo) {

                        expect(err).to.be.equal(null);
                        expect(todo.title).to.be.equal('updated title');
                        expect(todo.completed).to.be.equal(true);
                        done();
                    });
                });
        });

        it('delete', function (done) {
            var id = '00000000000000000000002';

            request(apiUrl)
                .del(todosUrl + '/' + id)
                .end(function (err, res) {

                    db.todo.findById(id, function (err, todo) {

                        expect(err).to.be.equal(null);
                        expect(todo).to.be.equal(null);
                        done();
                    });
                });
        });


        // it('read list', function (done) {
        //     request(apiUrl)
        //         .get(todosUrl)
        //         .end(function (err, res) {
        //             var todos = res.body;

        //             expect(todos).to.be.deep.equal(todosFixture);
        //             expect(err).to.be.equal(null);
        //             done();
        //         });
        // });
    });

});
