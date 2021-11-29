/**
 * Filename: 04-create-roles.js
 * Use: creates admin user, editor, author roles
 * Creator: core
 * Date: unknown
 */

'use strict';

module.exports = (server) => {
  const {Account, Role, RoleMapping} = server.models;

  // create admin account
  Account.findOrCreate({where: {email: 'admin@laya'}}, {
    email: 'admin@laya',
    username: 'admin',
    password: 'secret',
  }, (err, admin) => {
    if (err) {
      return console.error(err);
    }

    // Set Role
    Role.findOrCreate({where: {name: 'admin'}},
    {name: 'admin'},
    (err, role) => {
      if (err) {
        return console.error(err);
      }
      // create user principal for admin
      role.principals.find({principalId: admin.id},
        (err, principals) => {
          if (err) {
            return console.error(err);
          }
        // create if needed
          if (principals.length === (0 || 1)) {
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: admin.id,
            }, (err, principal) => {
              if (err) {
                return console.error(err);
              }
              return console.log('Admin Role Mapping created:', principal);
            });
          }
          if (principals.length === 2) {
            return console.log('Admin Role Mapping exists');
          }

          if (principals.length > 2) {
            throw new Error('Several Admins exist!');
          }
        });
    });
  });
};
