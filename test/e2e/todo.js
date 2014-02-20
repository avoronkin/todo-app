var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


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
var wd = require('wd');
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
wd.configureHttp({
  timeout: 60000,
  retries: 3,
  retryDelay: 100,
  baseUrl: 'http://example.com/'
});

var selenium;
var options = {};
// {
// desiredCapabilities: {
//     browserName: 'chrome'
// }
// };
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
                    options.hostname = selenium.host;
                    client = wd.promiseChainRemote(options);
                    // client = wd.remote(options).init(callback);
                    client.init({
                        browserName: 'chrome'
                    }).nodeify(done);
                });
            }
        ], function (err) {
            if (err) {
                return done(err);
            }
            done();
        });

    });

    it('should  find title', function (done) {
        this.timeout(25000);

        return client.get('http://www.google.com')
        .title().should.become('Google')
        .elementByCss('input[name=q]').type('blablabla')
        .elementByCss('[name="btnG"]').click().sleep(1000)
        .title().should.become('blablabla - Поиск в Google');

    });



    after(function (done) {
        async.series([
            server.close,
            // client.end.bind(client),
            function (callback) {
                client.quit().nodeify(callback)
            },
            function (callback) {
                selenium.on('close', function () {
                    console.log('selenium closed');
                    callback(false);
                });
                selenium.kill();
            },
        ], function (err) {
            console.log('after')
            if (err) return done(err);
            done();
        });
    });


});
