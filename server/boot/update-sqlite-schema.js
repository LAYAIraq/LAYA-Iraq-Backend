'use strict';

module.exports = function(app) {
  var db = app.dataSources.sqlite;
  db.isActual(function(err, actual) {
    if (!actual) {
      db.autoupdate();
    }
  });
};
