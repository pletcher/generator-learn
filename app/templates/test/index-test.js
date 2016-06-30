const expect = require('expect')
<% if (options.browser) { %>
const fs = require('fs')
const jsdom = require('mocha-jsdom')
const path = require('path')
<% } else { %>
const index = require('../index')
<% } %>

describe('index', () => {
  <% if (options.browser) { %>
  jsdom({
    src: fs.readFileSync(path.resolve(__dirname, '..', 'index.js'), 'utf-8')
  })
  <% } %>

  it('runs', () => {
    expect(true).toEqual(true)
  })
})
