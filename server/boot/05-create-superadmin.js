/**
 * Filename: 05-create-superadmin.js
 * Use: creates superadmin user
 * Creator: core & nv
 * Date: unknown
 */

'use strict';
const path = require('path');
module.exports = (server) => {
  const {Account, Role, RoleMapping} = server.models;

  const superAdminEmail = process.env.SUPERADMIN_MAIL || 'superadmin@laya';
  console.log(superAdminEmail);
  // create superadmin account
  Account.findOrCreate({where: {username: 'superadmin'}}, {
    email: superAdminEmail,
    username: 'superadmin',
    password: 'secret',
  }, (err, superAdmin) => {
    if (err) {
      return console.error(err);
    }

    // update email address if it's still superadmin@laya
    if (superAdmin.email === 'superadmin@laya') {
      superAdmin.updateAttribute('email', superAdminEmail, (err, superAdmin) => {
        if (err) {
          console.error('superadmin email reset failed!');
        } else {
          // console.log('admin email address set to ', admin.email);
          const verifyOptions = {
            type: 'email',
            to: superAdmin.email,
            from: process.env.MAIL_FROM || 'mock@laya-mail.com',
            subject: 'LAYA: You are the superadmin now!',
            host: process.env.FRONTEND_HOST || 'localhost',
            port: process.env.FRONTEND_PORT,
            template: path.resolve(__dirname, '../templates/admin-verify.ejs'),
            user: superAdmin,
          };
          superAdmin.verify(verifyOptions);
        }
      });
    }

    // Set Role
    Role.findOrCreate({where: {name: 'superadmin'}},
      {name: 'superadmin'},
      (err, role) => {
        if (err) {
          return console.error(err);
        }
        // create user principal for superadmin
        role.principals.find({principalId: superAdmin.id},
          (err, principals) => {
            if (err) {
              return console.error(err);
            }
            // create if needed
            if (principals.length === (0 || 1)) {
              role.principals.create({
                principalType: RoleMapping.USER,
                principalId: superAdmin.id,
              }, (err, principal) => {
                if (err) {
                  return console.error(err);
                }
                return console.log('SuperAdmin Role Mapping created:', principal);
              });
            }
            if (principals.length === 2) {
              return console.log('SuperAdmin Role Mapping exists');
            }

            if (principals.length > 2) {
              throw new Error('Several SuperAdmins exist!');
            }
          });
      });
  });
};
