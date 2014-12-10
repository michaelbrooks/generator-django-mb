'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var djangoUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var folderName = path.basename(process.cwd());

var DjangoGenerator = module.exports = function DjangoGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

   this.on('end', function() {
        this.log
            .write()
            .info("Project name is '%s'", this.projectName)
            .info("Admin name is '%s'", this.adminName)
            .info("Admin email is '%s'", this.adminEmail)
            .write()
            .info("If you have Vagrant installed, you can get running with: vagrant up")
            .info("Otherwise, you will need to install other prerequisites.")
            .write()
            .info("To start the server:")
            .info("Enter your project folder: cd " + this.projectName)
            .info("Run: python manage.py migrate")
            .info("Run: python manage.py runserver")
            .write();
    });

    this.pkg = require('../package.json');
    this.secretKey = djangoUtils.generateRandomString();
    this.sourceRoot(path.join(__dirname, '../templates'));
};

util.inherits(DjangoGenerator, yeoman.generators.Base);

DjangoGenerator.prototype.welcome = function welcome() {
    this.log(this.yeoman);
    this.log(
        chalk.magenta(
            'Thanks for using django-base! If you want to say hi write me an email at hello@marcosantonocito.com' +
            '\n'
        )
    );
};

DjangoGenerator.prototype.askForProjectInfo = function askForProjectInfo() {
    var cb = this.async();

    var prompts = [{
        type: 'input',
        name: 'projectName',
        message: 'What is your Django project name (should be letters and underscores, no hyphens)?',
        default: folderName.replace('-', '_')
    }, {
        type: 'input',
        name: 'adminName',
        message: 'What is the admin name?',
        default: 'Your Name'
    }, {
        type: 'input',
        name: 'adminEmail',
        message: 'What is the admin email?',
        default: 'your_email@domain.com'
    }];

    this.prompt(prompts, function (props) {
        this.projectName = props.projectName;
        this.folderName = folderName;
        this.adminName = props.adminName;
        this.adminEmail = props.adminEmail;

        cb();
    }.bind(this));
};

DjangoGenerator.prototype.askForDatabase = function askForDatabase() {
    var cb = this.async();

    this.log('\nThe Django project will include configuration for a Vagrant VM.');
    this.log('Please provide default database configuration for the Vagrant machine...\n');

    var prompts = [{
            type: 'input',
            name: 'databaseName',
            message: 'Please enter the database name',
            default: this.projectName
        }, {
            type: 'input',
            name: 'databaseUser',
            message: 'Please enter the database user',
            default: this.projectName
        }, {
            type: 'input',
            name: 'databasePassword',
            message: 'Please enter the database password',
            default: this.projectName
        }, {
            type: 'input',
            name: 'databaseHost',
            message: 'Please enter the database host',
            default: 'localhost'
        }, {
            type: 'input',
            name: 'databasePort',
            message: 'Please enter the database port',
            default: '3306'
        }
    ];

      this.prompt(prompts, function (props) {
        function isSelected(db) { return db == props.database; }

        // manually deal with the response, get back and store the results.
        // we change a bit this way of doing to automatically do this in the self.prompt() method.
        this.dbMysql = true;

        if (this.dbMysql || this.dbPostgres) {
            this.databaseName = props.databaseName;
            this.databaseUser = props.databaseUser;
            this.databasePassword = props.databasePassword;
            this.databaseHost = props.databaseHost;
            this.databasePort = props.databasePort;
        }

        cb();
    }.bind(this));
};

DjangoGenerator.prototype.manage = function manage() {
    this.template('manage.py', path.join(this.projectName, 'manage.py'));
};

DjangoGenerator.prototype.project = function project() {
    var projectFolder = path.join(this.projectName, this.projectName);
    this.directory('project', projectFolder)
    this.copy('__init__.py', path.join(projectFolder, '__init__.py'));
};

DjangoGenerator.prototype.baseApp = function baseApp() {
    this.directory('base', path.join(this.projectName, 'base'));
};

DjangoGenerator.prototype.assets = function assets() {
    this.directory('static', path.join(this.projectName, 'static'));
};

DjangoGenerator.prototype.templates = function templates() {
    this.directory('templates', path.join(this.projectName, 'templates'));
};

DjangoGenerator.prototype.requirements = function requirements() {
    this.template('requirements/base.txt', 'requirements/base.txt');
    this.copy('requirements/local.txt', 'requirements/local.txt');
    this.copy('requirements/production.txt', 'requirements/production.txt');
    this.copy('requirements/test.txt', 'requirements/test.txt');
    this.copy('requirements.txt', 'requirements.txt');
};

DjangoGenerator.prototype.git = function git() {
    this.copy('_gitignore', '.gitignore');
};

DjangoGenerator.prototype.editor = function editor() {
  this.copy('_editorconfig', '.editorconfig');
};

DjangoGenerator.prototype.bower = function bower() {
    this.template('_bower.json', 'bower.json');
};

DjangoGenerator.prototype.npm = function npm() {
    this.template('_package.json', 'package.json');
};

DjangoGenerator.prototype.vagrant = function dot_env() {
    this.template('Vagrantfile', 'Vagrantfile');
    this.directory('setup', 'setup');
};

DjangoGenerator.prototype.fabric = function fabric() {
    this.template('fabfile.py', 'fabfile.py');
};

DjangoGenerator.prototype.readme = function readme() {
    this.template('readme.md', 'README.md');
};

