import sys
import os

from fabric.api import local, env, run, cd, lcd
from fabric.contrib import files, console
from fabric.colors import red, green, yellow
from fabric.context_managers import warn_only, quiet, prefix, hide
from contextlib import contextmanager as _contextmanager
from path import path

SITE_ROOT = path(__file__).abspath().realpath().dirname()
DJANGO_ROOT = SITE_ROOT / '<%= projectName %>'
sys.path.append(DJANGO_ROOT)

_env_already_read = None


def _read_env():
    global _env_already_read

    if not _env_already_read:
        from <%= projectName %> import env_file

        _env_already_read = env_file.read(SITE_ROOT / '.env')

    return _env_already_read


_package_already_read = None


def _read_package():
    """Parse the package.json file"""
    global _package_already_read

    if not _package_already_read:
        import json

        with open(SITE_ROOT / 'package.json') as packfile:
            _package_already_read = json.load(packfile)
    return _package_already_read


def _get_settings():
    denv = _read_env()

    env.django_settings_module = denv.get('DJANGO_SETTINGS_MODULE', '<%= projectName %>.settings.production')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', env.django_settings_module)

    from django.conf import settings

    return settings


def dependencies():
    """Installs local packages"""

    _target_local()

    with lcd(SITE_ROOT):
        print green("Installing python requirements...")
        for req in env.pip_requirements:
            local('pip install -r %s' % req)

        print green("Installing node.js requirements...")
        if os.name == 'nt':
            local('npm install --no-bin-link')
        else:
            local('npm install')

        print green("Installing bower requirements...")
        local('bower install --config.interactive=false')
        local('bower prune --config.interactive=false')


def update_app():
    """Updates the code, database, and static files"""

    _target_local()

    print green("Running migrations...")
    _manage_py('migrate')


def _manage_py(args):
    with lcd(DJANGO_ROOT):
        local('python manage.py %s' % args)


def production():
    """Builds static files for production"""

    _target_local()

    print green("Gathering and preprocessing static files...")
    _manage_py('collectstatic --noinput')
    _manage_py('compress')


def _target_local():
    package = _read_package()
    settings = _get_settings()

    env.machine_target = 'local'

    if env.django_settings_module == '<%= projectName %>.settings.production':
        env.pip_requirements = ('requirements/production.txt',)
    else:
        env.pip_requirements = ('requirements/local.txt',)


def runserver():
    """Runs the Django development server"""
    _manage_py('runserver 0.0.0.0:8000')
