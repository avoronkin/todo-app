var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

var launcher = require('selenium-launcher');
var wd = require('webdriverjs');
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};
var selenium;

describe('e2e', function () {
    before(function (done) {
        launcher(function (err, sel) {
            if (err) return done(err);
            selenium = sel;
            done();
        });
    });

    after(function (done) {
        selenium.on('exit', function () {
            done();
        });
        selenium.kill();
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
