var Code = require('code');   // assertion library
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var Exec = require('../lib/base');
var path = require('path');

lab.test('stdout', function (done) {
    var exec = new Exec('ls');

    var stderr = false;
    var stdout = false;

    exec.on('stderr', function (msg) {
        Code.expect(msg).to.exist();
        stderr = true;
    });

    exec.on('stdout', function (msg) {
        Code.expect(msg).to.exist();
        stdout = true;
    });

    exec.on('exit', function (code) {
        Code.expect(code).to.equal(0);
        Code.expect(stderr).to.be.false();
        Code.expect(stdout).to.be.true();
        done();
    });

    exec.run();
});


lab.test('stderr', function (done) {
    var exec = new Exec('ls', ['-al', './doesnotexist'], {});
    var stderr = false;
    var stdout = false;

    exec.on('stderr', function (msg) {
        Code.expect(msg).to.exist();
        stderr = true;
    });

    exec.on('stdout', function (msg) {
        Code.expect(msg).to.exist();
        stdout = true;
    });

    exec.on('exit', function (code) {
        Code.expect(code).to.equal(1);
        Code.expect(stderr).to.be.true();
        Code.expect(stdout).to.be.false();
        done();
    });

    exec.run();
});


lab.test('error', function (done) {
    var exec = new Exec('appdoesnotexist', ['-al', './doesnotexist']);
    var stderr = false;
    var stdout = false;
    var error = false;

    exec.on('stderr', function (msg) {
        Code.expect(msg).to.exist();
        stderr = true;
    });

    exec.on('stdout', function (msg) {
        Code.expect(msg).to.exist();
        stdout = true;
    });

    exec.on('error', function (msg) {
        Code.expect(msg).to.exist();
        error = true;
    });

    exec.on('exit', function (code) {
        Code.expect(code).to.equal(-2);
        Code.expect(stderr).to.be.false();
        Code.expect(stdout).to.be.false();
        Code.expect(error).to.be.true();
        done();
    });

    exec.run();
});

lab.test('message', function (done) {
    var exec = new Exec('node', [path.join(__dirname, './dummy/echo.js')]);
    var message = false;

    exec.on('message', function () {
        message = true;
    });

    exec.on('exit', function (code) {
        Code.expect(code).to.equal(0);
        Code.expect(message).to.be.true();
        done();
    });

    exec.run();
});

lab.test('kill', function (done) {
    var exec = new Exec('sleep', ['15']);

    exec.on('exit', function (code) {
        Code.expect(code).to.not.exist;
        done();
    });

    exec.run();

    setTimeout(function () {
        exec.kill();
    }, 100);
});
