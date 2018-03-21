'use strict';

module.exports = function(app, cb) {
  var {sqlite} = app.dataSources;
  sqlite.isActual(function(err, actual) {
    if (!actual) {
      sqlite.autoupdate(function() {
        console.log('Database updated');
        cb();
      });
    } else cb();
  });
};
