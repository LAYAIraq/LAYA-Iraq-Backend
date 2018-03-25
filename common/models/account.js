'use strict';

module.exports = function(Account) {
  //
  // hide default create endpoint
  Account.disableRemoteMethodByName('create');

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
      verb: 'get',
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
      verb: 'get',
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

  //
  // create student
  Account.createStudent = function(user, cb) {
    const ROLE_NAME = 'student';
    const {Role, RoleMapping} = Account.app.models;

    Account.create(user, function(err, newUser) {
      if (err) return cb(err);

      //
      // set role
      Role.findOrCreate({where: {name: ROLE_NAME}}, {
        name: ROLE_NAME,
      }, function(err, role) {
        if (err) return cb(err);
        role.principals.create({
          principalId: newUser.id,
          principalType: RoleMapping.USER,
        }, function(err, principal) {
          if (err) return cb(err);

          //
          // return new student
          cb(null, newUser);
        });
      });
    });
  };

  Account.remoteMethod('createStudent', {
    http: {
      path: '/student',
      verb: 'post',
    },
    accepts: {
      arg: 'data',
      type: 'Account',
      http: {source: 'body'},
    },
    returns: {
      root: true,
      type: 'object',
    },
  });

  //
  // create author
  Account.createAuthor = function(user, cb) {
    const ROLE_NAME = 'author';
    const {Role, RoleMapping} = Account.app.models;

    Account.create(user, function(err, newUser) {
      if (err) return cb(err);

      //
      // set role
      Role.findOrCreate({where: {name: ROLE_NAME}}, {
        name: ROLE_NAME,
      }, function(err, role) {
        if (err) return cb(err);
        role.principals.create({
          principalId: newUser.id,
          principalType: RoleMapping.USER,
        }, function(err, principal) {
          if (err) return cb(err);

          //
          // return new student
          cb(null, newUser);
        });
      });
    });
  };

  Account.remoteMethod('createAuthor', {
    http: {
      path: '/author',
      verb: 'post',
    },
    accepts: {
      arg: 'data',
      type: 'Account',
      http: {source: 'body'},
    },
    returns: {
      root: true,
      type: 'object',
    },
  });

  //
  // get Role by userId ( returns student if error )
  Account.getRole = function(userId, cb) {
    const {Role} = Account.app.models;
    Role.getRoles({principalId: userId}, function(err, roles) {
      if (err) return cb(null, 'student');
      const lyRoles = roles.filter(Number);
      if (lyRoles.length == 0) return cb(null, 'student');
      Role.findOne({where: {id: lyRoles[0]}}, function(err, role) {
        if (err) return cb(null, 'student');
        cb(null, role.name);
      });
    });
  };

  Account.remoteMethod('getRole', {
    http: {
      path: '/:id/role',
      verb: 'get',
    },
    accepts: {
      arg: 'id',
      type: 'number',
      required: true,
    },
    returns: {
      arg: 'role',
      type: 'string',
    },
  });
};
