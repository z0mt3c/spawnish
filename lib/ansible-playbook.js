var base = require('./base');
var util = require('util');
var path = require('path');
var Hoek = require('hoek');

var defaults = {
    options: {
        env: {
            ANSIBLE_CALLBACK_PLUGINS: path.join(__dirname, '../ansible/callback_plugins'),
            ANSIBLE_RETRY_FILES_ENABLED: false
        }
    }

};

var Executer = function Executer(args, options) {
    options = Hoek.applyToDefaults(defaults.options, options || {});
    base.call(this, 'ansible-playbook', args, options);
};

util.inherits(Executer, base);

module.exports = Executer;