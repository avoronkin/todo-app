var expect = require('chai').expect;
var request = require('supertest');
var mongo = require('mongoskin');
var ObjectID = require('mongoskin').ObjectID;
var config = require('../../../config');
var db = mongo.db(config.mongo.host + '/' + config.mongo.db, {
    safe: true
});
var serverHost = 'http://' + config.http.host + ':' + config.http.port + '/api/';
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
        var url = 'todos';
        var collection = db.collection('todo');

        beforeEach(function (done) {
            collection.drop().insert(todosFixture, done);
        });

        it('create', function (done) {
            request(serverHost)
                .post(url)
                .send({
                    title: 'test title',
                    completed: false
                })
                .end(function (err, res) {
                    collection.findOne({
                        title: 'test title'
                    }, function (err, document) {

                        expect(err).to.be.equal(null);
                        expect(document).to.exist;
                        done();

                    });
                });
        });

        it('read', function (done) {
            request(serverHost)
                .get(url + '/00000000000000000000001')
                .end(function (err, res) {
                    var todo = res.body;

                    expect(err).to.be.equal(null);
                    expect(todo.title).to.be.equal('test1');
                    expect(todo.completed).to.be.equal(false);

                    done();
                });
        });

        it('update', function (done) {
            request(serverHost)
                .put(url + '/00000000000000000000001')
                .send({
                    title: 'updated title',
                    completed: true
                })
                .end(function (err, res) {
                    var todo = res.body;

                    expect(err).to.be.equal(null);
                    expect(todo.title).to.be.equal('updated title');
                    expect(todo.completed).to.be.equal(true);
                    done();

                });
        });

        it('delete', function (done) {
            request(serverHost)
                .del(url + '/00000000000000000000002')
                .end(function (err, res) {
                    collection.findOne({
                        _id: '00000000000000000000002'
                    }, function (err, doc) {

                        expect(err).to.be.equal(null);
                        expect(doc).to.be.equal(null);
                        done();

                    });
                });
        });


        it('read list', function (done) {
            request(serverHost)
                .get(url)
                .end(function (err, res) {

                    var todos = res.body;
                    expect(todos).to.be.deep.equal(todosFixture);
                    expect(err).to.be.equal(null);
                    done();

                });
        });
    });

});
