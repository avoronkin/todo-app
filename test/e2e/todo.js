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
var client;

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

                    client = wd.remote(options).init(callback);
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
        async.series([
            server.close,
            client.end.bind(client),
            function (callback) {
                selenium.on('close', function () {
                    console.log('selenium closed');
                    callback(false);
                });
                selenium.kill();
            },
        ], function (err) {
            if (err) return done(err);
            done();
        });
    });

    it('should  find title', function (done) {
        this.timeout(25000);

        client.url('http://www.google.com')
            .setValue('*[name="q"]', 'webdriverjs')
            .click('*[name="btnG"]')
            .pause(1000)
            .getTitle(function (err, title) {
                title.should.be.equal('webdriverjs - Поиск в Google');
                done();
            });
    });

});
