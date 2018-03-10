'use strict';

module.exports = function(app) {
  app.get('/api/lang', function(req, res) {
    var langHeader = req.headers['accept-language'];
    res.send(langHeader.split(',')[0].split('-')[1].toLowerCase());
  });
};

