var base = require('./base');
var util = require('util');
var path = require('path');
var Hoek = require('hoek');
var _ = require('lodash');

var defaults = {
    options: {
        env: {
            ANSIBLE_CALLBACK_PLUGINS: path.join(__dirname, '../ansible/callback_plugins'),
            ANSIBLE_RETRY_FILES_ENABLED: false
        }
    }

};

var internals = {
    prepareArguments: function(argsObj) {
        var args = [ argsObj.file ];

        if (argsObj.vars) {
            args.push('-e');

            args.push(_.map(argsObj.vars, function(value, key) {
                return key + '=\'' + value + '\'';
            }).join(' '));
        }

        return args;
    }
};

var Executer = function Executer(args, options) {
    if (_.isObject(args)) {
        args = internals.prepareArguments(args);
    }

    options = Hoek.applyToDefaults(defaults.options, options || {});
    base.call(this, 'ansible-playbook', args, options);
};

util.inherits(Executer, base);

module.exports = Executer;