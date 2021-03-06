#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "<%= projectName %>.settings.local")

    from <%= projectName %> import env_file
    from path import path

    PROJECT_ROOT = path(__file__).abspath().realpath().dirname().parent
    env_file.load(PROJECT_ROOT / '.env')

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
