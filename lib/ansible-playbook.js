var base = require('./base')
var util = require('util')
var path = require('path')
var Hoek = require('hoek')
var _ = require('lodash')

var defaults = {
  options: {
    env: {
      ANSIBLE_CALLBACK_PLUGINS: path.join(__dirname, '../ansible/callback_plugins'),
      ANSIBLE_RETRY_FILES_ENABLED: false,
      ANSIBLE_FORCE_COLOR: true,
      ANSIBLE_ERROR_ON_UNDEFINED_VARS: true
    }
  }
}

var PARAMS = [
  { key: 'connection', param: '-connection'},
  { key: 'forks', param: '--forks'},
  { key: 'inventoryFile', param: '--inventory-file'},
  { key: 'limit', param: '--limit'},
  { key: 'modulePath', param: '--module-path'},
  { key: 'privateKey', param: '--private-key'},
  { key: 'skipTags', param: '--skip-tags'},
  { key: 'startAtTask', param: '--start-at-task'},
  { key: 'suUser', param: '--su-user'},
  { key: 'sudoUser', param: '--sudo-user'},
  { key: 'tags', param: '--tags'},
  { key: 'user', param: '--user'},
  { key: 'timeout', param: '--timeout'},
  { key: 'vaultPasswordFile', param: '--vault-password-file'},
  { key: 'forks', param: '--forks'}
]

var FLAGS = [
  { key: 'flushCache', param: '--flush-cache'},
  { key: 'forceHandlers', param: '--force-handlers'},
  { key: 'listHosts', param: '--list-hosts'},
  { key: 'listTasks', param: '--list-tasks'},
  { key: 'step', param: '--step'},
  { key: 'su', param: '--su'},
  { key: 'sudo', param: '--sudo'},
  { key: 'syntaxCheck', param: '--syntax-check'},
  { key: 'version', param: '--version'},
  { key: 'help', param: '--help'},
  { key: 'diff', param: '--diff'},
  { key: 'askPass', param: '--ask-pass'},
  { key: 'askSuPass', param: '--ask-su-pass'},
  { key: 'askSudoPass', param: '--ask-sudo-pass'},
  { key: 'askVaultPass', param: '--ask-vault-pass'},
  { key: 'check', param: '--check'},
  { key: 'v', param: '-v'},
  { key: 'vv', param: '-vv'},
  { key: 'vvv', param: '-vvv'},
  { key: 'vvvv', param: '-vvvv'}
]

var internals = {
  prepareArguments: function (argsObj) {
    var args = [ argsObj.file ]

    if (!_.isEmpty(argsObj.extraVars)) {
      args.push('-e')

      args.push(_.map(argsObj.extraVars, function (value, key) {
        return key + "='" + value + "'"
      }).join(' '))
    }

    _.each(PARAMS, function (param) {
      if (_.has(argsObj, param.key) && argsObj[param.key] !== '') {
        args.push(param.param + '=' + argsObj[param.key])
      }
    })

    _.each(FLAGS, function (flag) {
      if (argsObj[flag.key]) {
        args.push(flag.param)
      }
    })

    if (argsObj.verbosity === 'verbose') {
      args.push('-v')
    } else if (argsObj.verbosity === 'debug') {
      args.push('-vvv')
    }

    return args
  }
}

var Executer = function Executer (args, options) {
  if (_.isObject(args)) {
    args = internals.prepareArguments(args)

  }

  options = Hoek.applyToDefaults(defaults.options, options || {})
  base.call(this, 'ansible-playbook', args, options)
}

util.inherits(Executer, base)

module.exports = Executer
