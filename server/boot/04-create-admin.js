'use strict';

module.exports = function(server) {
  let {Account, Role, RoleMapping} = server.models;

  //
  // admin account
  Account.findOrCreate({where: {email: 'admin@laya'}}, {
    email: 'admin@laya',
    username: 'admin',
    password: 'ivegotthepower',
  }, function(err, admin) {
    if (err) {
      return console.error(err);
    }

    //
    // Set Role
    Role.findOrCreate({where: {name: 'admin'}}, {
      name: 'admin',
    }, function(err, role) {
      if (err) {
        return console.error(err);
      }

      role.principals.find({
        where: {principalId: admin.id},
      }, function(err, principals) {
        if (err) {
          return console.error(err);
        }

        // create if needed
        if (principals.length == 0) {
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: admin.id,
          }, function(err, principal) {
            if (err) {
              return console.error(err);
            }
            return console.log('Admin Role Principal created:', principal);
          });
        }

        if (principals.length == 1) {
          return console.log('Admin Role Principals exists');
        }

        if (principals.length > 1) {
          throw console.error('Multiple Admin Role Principals exist!');
        }
      });
    });
  });
};

