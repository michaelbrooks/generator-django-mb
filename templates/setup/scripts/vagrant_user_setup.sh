#!/usr/bin/env bash

# User-local one-time setup for the project
# After running this, fab update should do the trick mostly.

# Die on errors
set -e

SITE_ROOT=/home/vagrant/<%= folderName %>

# Create a .env file
cp $SITE_ROOT/setup/templates/vagrant_dot_env $SITE_ROOT/.env

# Load virtualenvwrapper functions
source $(which virtualenvwrapper.sh)

# Make a virtualenv
mkvirtualenv <%= projectName %> -a $SITE_ROOT || true

# Install base python dependencies
pip install -r requirements/local.txt

# Bring everything up to date
fab dependencies update_app

# Add the workon command to the bashrc
if grep -q 'workon' /home/vagrant/.bashrc; then
    echo "workon already in bashrc"
else
    echo "workon coding_tool" >> /home/vagrant/.bashrc
    echo "added workon to bashrc"
fi
