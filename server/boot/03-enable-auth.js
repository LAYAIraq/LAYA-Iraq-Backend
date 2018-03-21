'use strict';

module.exports = function(server) {
  // server.enableAuth({dataSource: 'memory'});
  server.enableAuth();
  console.log('Auth enabled');
};
