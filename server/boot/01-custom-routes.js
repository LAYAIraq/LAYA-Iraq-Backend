/**
 * Filename: 01-custom-routes.js
 * Use: Set Up custom routes
 * Creator: core
 * Date: unknown
 */

'use strict';

module.exports = (server) => {
  console.log('Setting up custom routes');

  // server status
  server.get('/', server.loopback.status());

  // return client language header
  server.get('/api/lang', function(req, res) {
    const langHeader = req.headers['accept-language'];
    res.send(langHeader);
  });
};

