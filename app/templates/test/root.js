global.expect = require('expect');

const jsdom = require('jsdom');
const path = require('path');

<% if (options.browser) { %>before(function(done) {
  const src = path.resolve(__dirname, '..', 'index.js');

  jsdom.env('<div></div>', [src], (err, window) => {
    if (err) {
      return done(err);
    }

    Object.keys(window).forEach(key => {
      global[key] = window[key];
    });

    return done();
  });
}); <% } %>
