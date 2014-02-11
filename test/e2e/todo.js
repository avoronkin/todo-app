var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var async = require('async');

var config = require('../../config');
var mongo = require('mongoskin');
var db = mongo.db(config.mongo.host + '/' + config.mongo.db, {
    safe: true
});

db.bind('todo');
var todosFixture = require('../fixtures/todo');

var server = require('../../server');

var launcher = require('selenium-launcher');
var wd = require('webdriverjs');
var selenium;
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

describe('e2e', function () {
    before(function (done) {
        this.timeout(25000);

        async.parallel([
            function (callback) {
                db.todo.drop(function () {
                    console.log('Dropping todos collection');
                }).insert(todosFixture, function () {
                    console.log('Inserting fixture for todos collection');
                    callback(false);
                });
            },
            function (callback) {
                server.listen(config.http.port, callback);
            },
            function (callback) {
                launcher(function (err, sel) {
                    if (err) {
                        callback(err);
                    }
                    selenium = sel;
                    options.port = selenium.port;
                    options.host = selenium.host;
                    callback(false);
                });
            }
        ], function (err) {
            if (err) {
                return done(err);
            }
            done();
        });

    });

    after(function (done) {
        async.parallel([
            function (callback) {
                selenium.on('close', function () {
                    callback(false);
                });
                selenium.kill();
            },
            function (callback) {
                server.close(callback);
            }
        ], function (err) {
            if (err) return done(err);
            done();
        });
    });

    it('should  find title', function (done) {
        this.timeout(25000);

        wd.remote(options)
            .init()
            .url('http://www.google.com')
            .setValue('*[name="q"]', 'webdriverjs')
            .click('*[name="btnG"]')
            .pause(1000)
            .getTitle(function (err, title) {
                title.should.be.equal('webdriverjs - Поиск в Google');
            })
            .end(function () {
                done();
            });
    });

});
