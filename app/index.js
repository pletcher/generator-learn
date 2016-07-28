'use strict'

const childProcess = require('child_process')
const generators = require('yeoman-generator')
const kebabCase = require('lodash.kebabcase')

const browserDependencies = [
  'babel-core',
  'babel-preset-es2015',
  'jsdom'
]

const dependencies = [
  'expect',
  'mocha',
  'mocha-multi',
  'node-inspector'
]

const reactDependencies = [
  'react',
  'react-dom'
]

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments)

    this.argument('labName', { type: String, required: false })
  },

  prompting: function() {
    return this.prompt([{
      name: 'username',
      message: 'What is your name?',
      type: 'input',
      default: "The Flatiron School"
    }, {
      name: 'labName',
      message: "What is this lab's name?",
      type: 'input',
      default: this.labName || 'My Awesome Lab'
    }, {
      name: 'description',
      message: "What's a one-line description for the lab?",
      type: 'input'
    }, {
      choices: [
        "browser",
        "server",
        "both"
      ],
      name: 'environment',
      message: "Will this project run in the browser, on the server, or in both environments?",
      type: 'list'
    }, {
      name: "react",
      message: "Does this lab use React?",
      type: 'confirm',
      'when': function(answers) {
        return answers.environment !== 'server'
      }
    }]).then(answers => {
      this.options = answers
      this.options.browser = answers.environment !== 'server'
      this.options.kebabCaseName = kebabCase(answers.labName)
    })
  },

  configuring: function() {
    const cwd = process.cwd()
    const dirs = cwd.split('/')
    const dirName = dirs[dirs.length - 1]
    const rootDir = dirName === this.options.kebabCaseName ?
            '' : `/${this.options.kebabCaseName}`
    const root = `${this.destinationRoot()}${rootDir}`

    this.destinationRoot(root)
  },

  writing: function() {
    this.template('.editorconfig.sample', '.editorconfig')
    this.template('.gitignore.sample', '.gitignore')
    this.template('.learn', '.learn')
    this.template('CONTRIBUTING.md', 'CONTRIBUTING.md')
    this.template('LICENSE.md', 'LICENSE.md')
    this.template('README.md', 'README.md')
    this.template('index.js', 'index.js')
    this.template('package.json', 'package.json')
    this.template('bin/debug-ide', 'bin/debug-ide')
    this.template('test/index-test.js', 'test/index-test.js')
    this.template('test/mocha.opts', 'test/mocha.opts')
    this.template('test/root.js', 'test/root.js')

    if (this.options.browser) {
      this.template('index.html', 'index.html')
    }
  },

  install: function() {
    if (this.options.browser) {
      this.npmInstall(dependencies.concat(browserDependencies), { saveDev: true })
      if (this.options.react) {
        this.npmInstall(reactDependencies, { save: true })
      }
    } else {
      this.npmInstall(dependencies, { saveDev: true })
    }
  }
})
