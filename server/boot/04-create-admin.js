/**
 * Filename: 04-create-admin.js
 * Use: creates admin user if it doesn't exist
 * Creator: core
 * Date: unknown
 */

'use strict';

module.exports = (server) => {
  const {Account, Role, RoleMapping} = server.models;

  //
  // admin account
  Account.findOrCreate({where: {email: 'admin@laya'}}, {
    email: 'admin@laya',
    username: 'admin',
    password: 'secret',
  }, (err, admin) => {
    if (err) {
      return console.error(err);
    }

    //
    // Set Role
    Role.findOrCreate({where: {name: 'admin'}}, {
      name: 'admin',
    }, (err, role) => {
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
          }, (err, principal) => {
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

