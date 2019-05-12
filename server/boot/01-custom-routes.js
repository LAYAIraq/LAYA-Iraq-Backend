'use strict';

module.exports = function(server) {
  console.log('Setting up custom routes');

  //
  // server status
  server.get('/', server.loopback.status());

  //
  // return client language header
  server.get('/api/lang', function(req, res) {
    var langHeader = req.headers['accept-language'];
    res.send(langHeader);
  });
};

