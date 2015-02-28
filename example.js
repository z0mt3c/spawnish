var executer = require('./index');

var test = new executer.Base('test', ['-i', '/usr/local/etc/ansible/hosts', '/usr/local/etc/ansible/site.yml']);

var playbook = new executer.AnsiblePlaybook(['-i', '/usr/local/etc/ansible/hosts', '/usr/local/etc/ansible/site.yml']);

playbook.on('std', function(msg) {
    console.log(msg);
});

playbook.on('message', function(msg) {
    console.log('[IPC] ' + JSON.stringify(msg));
});

playbook.on('exit', function(msg) {
    console.log(msg);
});

playbook.run();