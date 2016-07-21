const expect = require('expect') <% if (options.browser) { %>
const fs = require('fs')
const jsdom = require('jsdom')
const path = require('path') <% } else { %>
const index = require('../index')<% } %>

describe('index', () => {<% if (options.browser) { %>
  before(done => {
    const html = path.resolve(__dirname, '..', 'index.html');
    const src = path.resolve(__dirname, '..', 'index.js');

    jsdom.env(html, [src], (err, window) => {
      if (err) {
        return done(err)
      }

      Object.keys(window).forEach(key => {
        global[key] = window[key]
      });

      return done();
    });
  });<% } %>

  it('runs', () => {
    expect(true).toEqual(true)
  })
})
