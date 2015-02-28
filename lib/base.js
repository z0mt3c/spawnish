var EventEmitter = require('events').EventEmitter;
var ChildProcess = require('child_process');
var spawn = ChildProcess.spawn;
var util = require('util');
var path = require('path');
var Hoek = require('hoek');

var defaults = {
    options: {
        cwd: process.cwd(),
        stdio: [null, null, null, 'ipc'],
        env: Hoek.applyToDefaults(process.env, {
            HOME: process.cwd()
        })
    }
};

var Executer = function Executer(command, args, options) {
    this.command = command;
    this.arguments = args || [];
    this.options = Hoek.applyToDefaults(defaults.options, options || {});
    this.process = null;
};

util.inherits(Executer, EventEmitter);

Executer.prototype.run = function () {
    this.kill();
    this.process = spawn(this.command, this.arguments, this.options);
    this._listenToProcess();
};

Executer.prototype._listenToProcess = function () {
    Hoek.assert(this.process, 'Process not available');
    var self = this;

    this.process.stdout.on('data', function (data) {
        if (data) {
            var log = data.toString();
            self.emit('std', log);
            self.emit('stdout', log);
        }
    });

    this.process.stderr.on('data', function (data) {
        if (data) {
            var log = data.toString();
            self.emit('std', log);
            self.emit('stderr', log);
        }
    });

    this.process.on('message', function (data) {
        self.emit('message', data);
    });

    this.process.on('error', function (error) {
        self.emit('error', error);
    });

    this.process.on('close', function (code) {
        self.emit('exit', code);
    });
};


Executer.prototype.kill = function (signal) {
    if (this.process) {
        this.process.kill(signal);
    }
};

module.exports = Executer;