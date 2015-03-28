var Code = require('code')
var Lab = require('lab')
var lab = exports.lab = Lab.script()
var Exec = require('../lib/script')

lab.test('script', function (done) {
  var exec = new Exec('echo "test"\necho \'{"test":"test"}\' >&3')

  var message = false
  var stdout = false

  exec.on('stdout', function (msg) {
    Code.expect(msg).to.deep.equal('test\n')
    stdout = true
  })

  exec.on('message', function (msg) {
    Code.expect(msg).to.deep.equal({test: 'test'})
    message = true
  })

  exec.on('exit', function (code) {
    Code.expect(code).to.equal(0)
    Code.expect(stdout).to.be.true()
    Code.expect(message).to.be.true()
    done()
  })

  exec.run()
})
