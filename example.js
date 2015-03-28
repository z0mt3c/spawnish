var executer = require('./index')

// var test = new executer.Base('test', ['-i', '/usr/local/etc/ansible/hosts', '/usr/local/etc/ansible/site.yml'])
// var test = new executer.AnsiblePlaybook(['-i', '/usr/local/etc/ansible/hosts', '/usr/local/etc/ansible/site.yml'])
var test = new executer.Script('echo "test"\necho "meep"\n echo \'{"test":"test"}\' >&3')

test.on('stdout', function (msg) {
  process.stdout.write('[OUT] ' + msg)
})
test.on('stderr', function (msg) {
  process.stderr.write('[ERR] ' + msg)
})

test.on('message', function (msg) {
  console.log('[IPC] ' + JSON.stringify(msg))
})

test.on('exit', function (msg) {
  console.log(msg)
})

test.run()
