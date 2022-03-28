/**
 * Filename: 04-create-roles.js
 * Use: creates admin user, editor, author roles
 * Creator: core
 * Date: unknown
 */

'use strict';
const path = require('path');
module.exports = (server) => {
  const {Account, Role, RoleMapping} = server.models;

  const adminEmail = process.env.ADMIN_MAIL || 'admin@laya';
  console.log(adminEmail);
  // create admin account
  Account.findOrCreate({where: {username: 'admin'}}, {
    email: adminEmail,
    username: 'admin',
    password: 'secret',
  }, (err, admin) => {
    if (err) {
      return console.error(err);
    }

    // update email address if it's still admin@laya
    if (admin.email === 'admin@laya') {
      admin.updateAttribute('email', adminEmail, (err, admin) => {
        if (err) {
          console.error('admin email reset failed!');
        } else {
          // console.log('admin email address set to ', admin.email);
          const verifyOptions = {
            type: 'email',
            to: admin.email,
            from: process.env.MAIL_FROM || 'mock@laya-mail.com',
            subject: 'LAYA: You are the admin now!',
            host: process.env.FRONTEND_HOST || 'localhost',
            port: process.env.FRONTEND_PORT,
            template: path.resolve(__dirname, '../templates/admin-verify.ejs'),
            user: admin,
          };
          admin.verify(verifyOptions);
        }
      });
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
