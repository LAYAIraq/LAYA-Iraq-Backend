"use strict";

module.exports = function(app, cb) {
  const { sqlite } = app.dataSources;
  sqlite.isActual((err, actual) => {
    if (!actual) {
      sqlite.autoupdate( () => {
        console.log("Database updated");
        cb();
      });
    } 
    else {
      console.log("No Update to Database")
      cb();
    }
  });
};
