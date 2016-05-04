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
      this.options.kebabCaseName = kebabCase(answers.labName)
    })
  },

  writing: function() {
    const cwd = process.cwd()
    const dirs = cwd.split('/')
    const dirName = dirs[dirs.length - 1]
    const root = dirName === this.options.kebabCaseName ?
            '' : this.options.kebabCaseName

    this.template('.editorconfig.sample', `${root}/.editorconfig`)
    this.template('.gitignore.sample', `${root}/.gitignore`)
    this.template('.learn', `${root}/.learn`)
    this.template('CONTRIBUTING.md', `${root}/CONTRIBUTING.md`)
    this.template('README.md', `${root}/README.md`)
    this.template('package.json', `${root}/package.json`)
  },

  install: function() {
    if (this.options.environment !== "server") {
      return this.npmInstall(dependencies.concat(browserDependencies), { saveDev: true })
    }

    this.npmInstall(dependencies, { saveDev: true })
  }
})
