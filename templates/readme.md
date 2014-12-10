<%= projectName %>
=========

Run in a VM
-----------

There is configuration included to run this project
inside an Ubuntu virtual machine controlled by Vagrant.

This is especially recommended on Windows.
If you go that route, you can skip the Prerequisites and Development Setup
sections below.

Instead, follow these steps:

1. Install [Vagrant](https://www.vagrantup.com/downloads.html) and [Virtualbox](https://www.virtualbox.org/wiki/Downloads)

2. Start the virtual machine.

   This will download a basic Ubuntu image, install
   some additional software on it, and perform the initial project setup.

   ```bash
   $ vagrant up
   ```

3. Once your Ubuntu VM is started, you can SSH into it with `vagrant ssh` or SSH to `localhost:2222`

   The Django development server on the VM will be accessible in your browser at `localhost:8080`


Development Setup
-------------

Your system should have the following installed to use this project:

- Python 2.7
<% if (dbMysql) { %>
- MySQL 5.5
<% } else if (dbPostgres) { %>
- Postgres
<% } else if (dbSqlite3) { %>
- Sqlite 3
<% } %>
- pip
- Node.js with npm
- [Bower](http://bower.io/)

Once you have the prerequisites installed, follow these steps
to set up the project:

1. Create a MySQL database.

2. Create a file in the main project folder
   called `.env` with the following:

   ```
   DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/NAME
   ```

3. Install Python dependencies.

   Note: It is recommended that you create and work in
   a [virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs/).

   Run this to install needed python modules:

   ```bash
   $ pip install -r requirements/local.txt
   ```

4. Install any additional requirements and run the database migrations:

   ```bash
   $ fab update
   ```

Development Workflow
--------------------

Once you are in the project directory, you can start the development
webserver using
