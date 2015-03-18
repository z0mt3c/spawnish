var base = require('./base');
var util = require('util');
var path = require('path');
var Hoek = require('hoek');
var _ = require('lodash');

var defaults = {
    options: {
        env: {
            ANSIBLE_CALLBACK_PLUGINS: path.join(__dirname, '../ansible/callback_plugins'),
            ANSIBLE_RETRY_FILES_ENABLED: false,
            ANSIBLE_FORCE_COLOR: true,
            ANSIBLE_ERROR_ON_UNDEFINED_VARS: true
        }
    }

};

var internals = {
    prepareArguments: function(argsObj) {
        var args = [ argsObj.file ];

        if (!_.isEmpty(argsObj.vars)) {
            args.push('-e');

            args.push(_.map(argsObj.vars, function(value, key) {
                return key + '=\'' + value + '\'';
            }).join(' '));
        }

        if (argsObj.inventoryFile) {
            args.push('--inventory-file='+argsObj.inventoryFile);
        }

        if (argsObj.privateKey) {
            args.push('--private-key='+argsObj.privateKey);
        }


        if (argsObj.check) {
            args.push('--check');
        }

        if (argsObj.verbosity === 'verbose') {
            args.push('-v');
        } else if (argsObj.verbosity == 'debug') {
            args.push('-vvv');
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
