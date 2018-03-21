'use strict';

module.exports = function(Account) {
  //
  // exists by name
  Account.existsByName = function(name, cb) {
    Account.find({where: {username: name}}, function(err, accounts) {
      if (accounts.length > 0)
        cb(null, true);
      else
        cb(null, false);
    });
  };

  Account.remoteMethod('existsByName', {
    http: {
      path: '/name/:name',
      verb: 'head',
    },
    accepts: {
      arg: 'name',
      type: 'string',
    },
    returns: {
      root: true,
      type: 'boolean',
    },
  });

  //
  // exists by email
  Account.existsByEmail = function(email, cb) {
    Account.find({where: {email: email}}, function(err, accounts) {
      if (accounts.length > 0)
        cb(null, true);
      else
        cb(null, false);
    });
  };

  Account.remoteMethod('existsByEmail', {
    http: {
      path: '/email/:email',
      verb: 'head',
    },
    accepts: {
      arg: 'email',
      type: 'string',
    },
    returns: {
      root: true,
      type: 'boolean',
    },
  });
};
