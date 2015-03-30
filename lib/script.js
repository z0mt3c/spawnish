var base = require('./base')
var util = require('util')
var Hoek = require('hoek')
var tmp = require('tmp')
var fs = require('fs')

var Executer = function Executer (script, args, options) {
  this.script = script
  base.call(this, null, args, options)
}

util.inherits(Executer, base)

Executer.prototype.run = function () {
  var self = this

  var internals = {
    create: function () {
      tmp.file({mode: '0744', prefix: 'spawnish-', postfix: '.sh'}, internals.created)
    },
    created: function (error, path, fd) {
      Hoek.assert(!error)
      self.command = path

      fs.write(fd, self.script, function (error) {
        Hoek.assert(!error)
        fs.close(fd, internals.run)
      })
    },
    run: function () {
      base.prototype.run.call(self)
    }
  }

  internals.create()
}

module.exports = Executer
