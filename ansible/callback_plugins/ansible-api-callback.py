import sys
import os
from json import JSONEncoder

def _send_silent(string):
    try:
        os.write(3, JSONEncoder().encode(string) + '\n')
    except OSError:
        sys.stderr.write("[PLUGIN:ERROR]: Could not log through IPC")
    except TypeError:
        pass

def _send(string):
    try:
        os.write(3, JSONEncoder().encode(string) + '\n')
    except OSError:
        sys.stderr.write("[PLUGIN:ERROR]: Could not log through IPC")
    except TypeError:
        sys.stderr.write("[PLUGIN:ERROR]: Exception during serialization")


def ipc_log(task, data=None, silent=False):
    event = {'_app_ext': 'ansible', 'task': task}
    if data:
        event.update(data)

    if silent:
        _send_silent(event)
    else:
        _send(event)


class CallbackModule(object):
    def on_any(self, *args, **kwargs):
        if len(args) > 0 and len(kwargs) > 0:
            ipc_log('on_any', {'args': args, 'kwargs': kwargs}, True)
        pass

    def runner_on_failed(self, host, result, ignore_errors=False):
        ipc_log('runner_on_failed', {'host': host, 'result': result, 'ignoreErrors': ignore_errors});

    def runner_on_ok(self, host, result):
        ipc_log('runner_on_ok', {'host': host, 'result': result})

    def runner_on_error(self, host, msg):
        ipc_log('runner_on_error', {'host': host, 'msg': msg})
        pass

    def runner_on_skipped(self, host, item=None):
        ipc_log('runner_on_skipped', {'host': host, 'item': item})
        pass

    def runner_on_unreachable(self, host, result):
        ipc_log('runner_on_unreachable', {'host': host, 'result': result})

    def runner_on_no_hosts(self):
        ipc_log('runner_on_no_hosts')
        pass

    def runner_on_async_poll(self, host, result, jid, clock):
        ipc_log('runner_on_async_poll', {'host': host, 'result': result, 'jid': jid, 'clock': clock})

    def runner_on_async_ok(self, host, result, jid):
        ipc_log('runner_on_async_ok', {'host': host, 'result': result, 'jid': jid})

    def runner_on_async_failed(self, host, result, jid):
        ipc_log('runner_on_async_failed', {'host': host, 'result': result, 'jid': jid})

    def playbook_on_start(self):
        ipc_log('playbook_on_start')
        pass

    def playbook_on_notify(self, host, handler):
        ipc_log('playbook_on_notify', {'host': host, 'handler': handler})
        pass

    def playbook_on_no_hosts_matched(self):
        ipc_log('playbook_on_no_hosts_matched')
        pass

    def playbook_on_no_hosts_remaining(self):
        ipc_log('playbook_on_no_hosts_remaining')
        pass

    def playbook_on_task_start(self, name, is_conditional):
        ipc_log('playbook_on_task_start', {'name': name})
        pass

    def playbook_on_vars_prompt(self, varname, private=True, prompt=None, encrypt=None, confirm=False, salt_size=None,
                                salt=None, default=None):
        ipc_log('playbook_on_vars_prompt',
                {'varname': varname, 'private': private, 'prompt': prompt, 'encrypt': encrypt, 'confirm': confirm,
                 'saltSize': salt_size, 'salt': salt, 'default': default})
        pass

    def playbook_on_setup(self):
        ipc_log('playbook_on_setup')
        pass

    def playbook_on_import_for_host(self, host, imported_file):
        ipc_log('playbook_on_import_for_host', {'host': host, 'importedFile': imported_file})
        pass

    def playbook_on_not_import_for_host(self, host, missing_file):
        ipc_log('playbook_on_not_import_for_host', {'host': host, 'missingFile': missing_file})
        pass

    def playbook_on_play_start(self, pattern):
        ipc_log('playbook_on_play_start', {'pattern': pattern})
        pass

    def playbook_on_stats(self, stats):
        hosts = sorted(stats.processed.keys())
        results = []
        failures = False
        unreachable = False

        for host in hosts:
            summary = {'host': host}
            summary.update(stats.summarize(host))
            results.append(summary);

            if summary['failures'] > 0:
                failures = True
            if summary['unreachable'] > 0:
                unreachable = True

        ipc_log('playbook_on_stats', {'stats': results})
        pass