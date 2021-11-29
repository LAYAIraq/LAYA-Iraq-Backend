/**
 * Filename: 04-create-roles.js
 * Use: creates admin user, editor, author roles
 * Creator: core
 * Date: unknown
 */

'use strict';

module.exports = (server) => {
  const {Role, RoleMapping} = server.models;

  // admin role
  Role.findOrCreate(
    {where: {name: 'admin'}},
    {name: 'admin'},
    (err, role) => {
      if (err) {
        return console.error(err);
      }
      role.principals.find({principalId: 'admin'},
        (err, editors) => {
          if (editors.length === 0) {
            role.principals.create({
              principalType: RoleMapping.ROLE,
              principalId: 'admin',
            }, (err, principal) => {
              if (err) {
                return console.error(err);
              } else
                return console.log('Admin Role Principal created: ',
                  principal);
            });
          } else {
            return console.log('Admin Role Principal exists');
          }
        });
    });
  // editor role
  Role.findOrCreate(
    {where: {name: 'editor'}},
    {name: 'editor'},
    (err, role) => {
      if (err) {
        return console.error(err);
      }
      role.principals.find({principalId: 'editor'}, (err, editors) => {
        if (editors.length === 0) {
          role.principals.create({
            principalType: RoleMapping.ROLE,
            principalId: 'editor',
          }, (err, principal) => {
            if (err) {
              return console.error(err);
            } else
              return console.log('Editor Role created: ', principal);
          });
        } else {
          console.log('Editor Role Principal exists');
        }
      });
    });

  // author role
  Role.findOrCreate(
    {where: {name: 'author'}},
    {name: 'author'},
    (err, role) => {
      if (err) {
        return console.error(err);
      }
      role.principals.find({principalId: 'author'}, (err, authors) => {
        if (authors.length === 0) {
          role.principals.create({
            principalType: RoleMapping.ROLE,
            principalId: 'author',
          }, (err, principal) => {
            if (err) {
              return console.error(err);
            }
            return console.log('Author role principal created: ', principal);
          });
        } else {
          console.log('Author Role Principal exists');
        }
      });
    });

  Role.findOrCreate(
    {where: {name: 'student'}},
    {name: 'student'},
    (err, role) => {
      if (err) {
        return console.error(err);
      }
      role.principals.find({principalId: 'student'}, (err, students) => {
        if (students.length === 0) {
          role.principals.create({
            principalType: RoleMapping.ROLE,
            principalId: 'student',
          }, (err, principal) => {
            if (err) {
              return console.error(err);
            }
            return console.log('Student Role Principal created: ', principal);
          });
        } else {
          console.log('Student Role Principal exists');
        }
      });
    });
};
