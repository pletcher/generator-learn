'use strict'

const childProcess = require('child_process')
const generators = require('yeoman-generator')
const kebabCase = require('lodash.kebabcase')

const browserDependencies = [
  'jsdom',
  'mocha-jsdom'
]

const dependencies = [
  'chai',
  'mocha'
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
      default: childProcess.execSync('whoami').toString().trim()
    }, {
      name: 'labName',
      message: "What is this lab's name?",
      type: 'input',
      default: this.labName || 'My Awesome Lab',
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
      type: 'list',
    }]).then(answers => {
      this.options = answers
      this.options.browser = answers.environment !== 'server'
      this.options.kebabCaseName = kebabCase(answers.labName)
    })
  },

  configuring: function() {
    this.root = `${this.destinationRoot()}/${this.options.kebabCaseName}`
  },

  writing: function() {
    this.template('.editorconfig.sample', `${this.root}/.editorconfig`)
    this.template('.gitignore.sample', `${this.root}/.gitignore`)
    this.template('.learn', `${this.root}/.learn`)
    this.template('CONTRIBUTING.md', `${this.root}/CONTRIBUTING.md`)
    this.template('LICENSE.md', `${this.root}/LICENSE.md`)
    this.template('README.md', `${this.root}/README.md`)
    this.template('index.js', `${this.root}/index.js`)
    this.template('package.json', `${this.root}/package.json`)
    this.template('test/index-test.js', `${this.root}/test/index-test.js`)
  },

  install: function() {
    if (this.options.browser) {
      return this.npmInstall(dependencies.concat(browserDependencies), { saveDev: true })
    }

    this.npmInstall(dependencies, { saveDev: true })
  }
})
