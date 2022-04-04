/**
 * Filename: account.js
 * Use: Define additional methods for account data model
 * Creator: core
 * Date: unknown
 */
'use strict';

const path = require('path');
const ejs = require('ejs');
const crypto = require('crypto');
module.exports = (Account) => {
  // disable default create endpoint
  Account.disableRemoteMethodByName('create');

  /**
   * Function changeLanguage: change user's language
   *
   * Author: cmc
   *
   * Last Updated: August 19, 2020
   *
   * @param {object} data user uid and new language
   * @param {Function} cb callback function
   */
  Account.changeLanguage = (data, cb) => {
    const uid = data.uid;
    const newlang = data.lang;

    // find user, if found update attributes
    Account.findById(uid, (err, user) => {
      if (err) {
        console.error(err);
        cb(null, false);
      }
      else {
        user.updateAttributes({lang: newlang}, (err) => {
          if (err) {
            console.error(err);
            cb(null, false);
          }
          else {
            // console.log(`User #${user.id}'s language updated to ${user.lang}`);
            cb(null, true);
          }
        });
      }
    });
  };

  /**
   * function changeRole: change role of given userId
   *
   * Author: cmc
   *
   * Last Updated: November 26, 2021
   * @param data userId: number, role: string
   * @param cb returns roleMapping instance if successful
   */
  Account.changeRole = (data, cb) => {
    if (!data.role || !data.userId) {
      const error = new Error('Not all params given!');
      error.status = 400;
      cb(error);
    } else if (data.role === 'admin') {
      const error = new Error('Changing role to admin is not allowed!');
      error.status = 403;
      cb(error);
    } else {
      const {RoleMapping} = Account.app.models;
      RoleMapping.findOne({where: {principalId: data.userId}}, (err, map) => {
        if (!map) {
          const error = new Error(`No user with id ${data.userId} found!`);
          error.status = 404;
          cb(error, null);
        } else {
          RoleMapping.findOne({where: {principalId: data.role}},
            (err, roleMap) => {
              if (err) {
                // console.error(`No role ${data.role} found!`);
                const error = new Error('No role ${data.role} found!');
                error.status = 404;
                cb(error, null);
              }
              if (!roleMap) {
                const error = new Error('No such role found!');
                error.status = 404;
                cb(error, null);
              } else {
                map.updateAttributes({roleId: roleMap.roleId},
                  (err, updatedMap) => {
                    if (err) {
                      // console.error('Some failure with updating the attribute: ', err);
                      cb(new Error('Attribute missing!').status(400));
                    } else {
                      // console.log(
                      //   `user ${data.userId}'s role changed to: ${data.role}`
                      // );
                      cb(null, updatedMap);
                    }
                  });
              }
            });
        }
      });
    }
  };

  /**
   * Function createStudent: create a user in 'student' role
   *
   * Author: core
   *
   * Last Updated: unknown
   *
   * @param {object} user user object to be inserted
   * @param {Function} cb callback function
   */
  Account.createStudent = (user, cb) => {
    const ROLE_NAME = 'student';
    // if (!user.password) {
    //   user.password = Account.randomPassword(16);
    // }
    Account.create(user, (err, newUser) => {
      if (err) return cb(err);
      const {Role, RoleMapping} = Account.app.models;
      // set role
      Role.findOrCreate({where: {name: ROLE_NAME}}, {
        name: ROLE_NAME,
      }, (err, role) => {
        if (err) return cb(err);
        role.principals.create({
          principalId: newUser.id,
          principalType: RoleMapping.USER,
        }, (err) => {
          if (err) return cb(err);

          //
          // return new student
          cb(null, newUser);
        });
      });
    });
  };

  /**
   * Function createUser: create user from admin panel
   *
   * Author: cmc
   *
   * Last Updated: December 7, 2021
   *
   * @param {email, username, role} user new user
   * @param {Function} cb callback function
   */
  Account.createUser = ({email, username, role}, cb) => {
    const pwd = Account.randomPassword(12);
    // create new user
    Account.create({
      username: username,
      email: email,
      password: pwd,
    }, (err, newUser) => {
      if (err) return cb(null, err);
      else {
        const {Role, RoleMapping} = Account.app.models;
        // create RoleMapping
        Role.findOne({where: {name: role}}, (err, userRole) => {
          if (err) cb(null, err);
          userRole.principals.create({
            principalId: newUser.id,
            principalType: RoleMapping.USER,
          }, (err) => {
            if (err) return cb(null, err);
            cb(null, newUser);
            // send verification email
            const verifyOptions = {
              type: 'email',
              to: newUser.email,
              from: process.env.MAIL_FROM,
              subject: 'You have been registered for LAYA',
              template: path.resolve(__dirname,
                '../../server/templates/created-by-admin.ejs'),
              user: newUser,
              host: process.env.FRONTEND_HOST || 'localhost',
              port: process.env.FRONTEND_PORT,
              pwd: pwd,
            };

            newUser.verify(verifyOptions);
          });
        });
      }
    });
  };

  /**
   * function deleteUser: delete user and corresponding rolemapping
   *
   * Author: cmc
   *
   * Last Updated: December 13, 2021
   * @param userId user to be deleted
   * @param cb returns false if no RoleMapping existed, true if both gone
   */
  Account.deleteUser = (userId, cb) => {
    // console.log('User to be deleted: ' + userId);
    Account.findById(userId, (err, user) => {
      if (!user) {
        const error = new Error('No User found!');
        error.status = 404;
        cb(error);
      } else {
        user.destroy();
        const {RoleMapping} = Account.app.models;
        RoleMapping.findOne({where: {principalId: userId}}, (err, map) => {
          if (!map) {
            console.error('mapping not found!');
            cb(null, false);
          } else {
            map.destroy();
            cb(null, true);
          }
        });
      }
    });
  };

  /**
   * Function existsByEmail: checks if user email exists
   *
   * Author: core
   *
   * Last Updated: unknown
   *
   * @param {string} email user email to be found
   * @param {Function} cb callback function
   */
  Account.existsByEmail = (email, cb) => {
    Account.findOne({where: {email: email}}, (err, account) => {
      if (account) {
        cb(null, account.id);
      }
      else {
        const err = new Error('email not found');
        err.status = 404;
        cb(err);
      }
    });
  };

  /**
   * Function existsByName: check if the username exists
   *
   * Author: core
   *
   * Last Updated: unknown
   *
   * @param {string} name user name to be found
   * @param {Function} cb callback function
   */
  Account.existsByName = (name, cb) => {
    Account.find({where: {username: name}}, (err, accounts) => {
      if (accounts.length > 0)
        cb(null, true);
      else
        cb(null, false);
    });
  };

  /**
   * Function getRole: get the Role of a user
   *
   * Author: core
   *
   * Last Updated: unknown
   *
   * @param {string} userId user ID
   * @param {Function} cb callback function
   * @returns student if error
   */
  Account.getRole = (userId, cb) => {
    const {Role} = Account.app.models;
    Role.getRoles({principalId: userId}, {}, (err, roles) => {
      if (err) {
        return cb(null, 'student');
      }
      const lyRoles = roles.filter(Number);
      // console.log(lyRoles)
      if (lyRoles.length === 0) {
        return cb(null, 'student');
      }
      Role.findOne({where: {id: lyRoles[0]}}, (err, role) => {
        if (err) {
          return cb(null, 'student');
        }
        cb(null, role.name);
      });
    });
  };

  /**
   * Function pwdReset: fire password reset for userId
   *
   * Author: cmc
   *
   * Last Updated: January 18, 2022
   * @param userId
   * @param cb callback function to return boolean
   */
  Account.pwdReset = (userId, cb) => {
    Account.findById(userId, (err, user) => {
      if (err) {
        cb('user not found!');
      } else if (user) { // userID exists
        crypto.randomBytes(64, (err, buf) => { // create new verificationToken
          const pwd = Account.randomPassword(12);
          const token = buf.toString('hex');
          // console.log(pwd, token);
          user.updateAttributes({
            password: pwd,
            verificationToken: token,
          },
            (err) => {
            // Account.generateVerificationToken(user, (err, token) => {
              if (err) {
                cb('password reset failed');
              } else {
                // console.log(token);
                // const ejs = require('ejs');
                const html = Account.renderTemplate(
                  '../templates/pwd-reset.ejs',
                  {
                    host: process.env.FRONTEND_HOST || 'localhost',
                    port: process.env.FRONTEND_PORT,
                    user: user,
                  }
                );
                console.log(html);
                const {Email} = Account.app.models;
                Email.send({
                  type: 'email',
                  to: user.email,
                  from: process.env.MAIL_FROM,
                  subject: 'Your password has been reset',
                  // host: process.env.FRONTEND_HOST || 'localhost',
                  // port: process.env.FRONTEND_PORT,
                  html: html,
                  // pwd: Account.randomPassword(12),
                  // // eslint-disable-next-line
                  // template: path.resolve(__dirname, '../../server/templates/pwd-reset.ejs'),
                  // user: user,
                }, err => {
                  if (err) console.error(err);
                  // console.log('sending email');
                });
                cb(null, true);
              }
            });
        });
      } else {
        const err = new Error('no user exists with this ID');
        err.status = 404;
        cb(err);
      }
    });
  };

  /**
   * Function setNewPwd: set new password when verification token exists
   *
   * Author: cmc
   *
   * Last Updated: January 18, 2022
   * @param userId id of user
   * @param password new password
   * @param verificationToken verification token
   * @param cb callback
   */
  Account.setNewPwd = ({userId, password, verificationToken}, cb) => {
    Account.findById(userId, (err, user) => {
      if (err) {
        const {name, message, statusCode} = err;
        cb({name, message, statusCode});
      } else {
        Account.confirm(userId, verificationToken, '', err => {
          if (err) {
            const {name, message, statusCode} = err;
            cb({name, message, statusCode});
          } else {
            user.setPassword(password, err => {
              if (err) {
                const {name, message, statusCode} = err;
                cb({name, message, statusCode});
              } else {
                cb(null, true);
              }
            });
          }
        });
      }
    });
  };

  /****************************************************************************
   ************************* REMOTE METHOD SIGNATURES *************************
   ****************************************************************************/
  Account.remoteMethod('changeLanguage', {
    http: {
      path: '/:id/change-language',
      verb: 'post',
    },
    accepts: {
      arg: 'data',
      type: 'object',
      http: {source: 'body'},
      required: true,
    },
    returns: {
      root: true,
      type: 'boolean',
    },
    description: 'Change language for the user with ID',
  });

  Account.remoteMethod('changeRole', {
    http: {
      path: '/change-role',
      verb: 'post',
    },
    accepts: {
      arg: 'data',
      http: {source: 'body'},
      type: 'object',
      required: true,
    },
    returns: {
      arg: 'user',
      type: 'object',
    },
    description: 'Fire Role Change Request for userId',
  });

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
    description: 'Creates a new user with student role',
  });

  Account.remoteMethod('createUser', {
    http: {
      path: '/create',
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
    description: 'Create new user with random password, role can be set',
  });

  Account.remoteMethod('deleteUser', {
    http: {
      path: '/:id/full',
      verb: 'delete',
    },
    accepts: {
      arg: 'id',
      type: 'number',
      required: true,
    },
    returns: {
      arg: 'deleted',
      type: 'boolean',
    },
    description: 'Delete User and corresponding role mapping',
  });

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
      type: 'number',
    },
    description: 'Returns user id if given email exists',
  });

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
    description: 'Returns true if account with that name exists',
  });

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
    description: 'Return role of given user ID',
  });

  Account.remoteMethod('pwdReset', {
    http: {
      path: '/pwd-reset/:userId',
      verb: 'post',
    },
    accepts: {
      arg: 'userId',
      type: 'number',
      required: true,
    },
    returns: {
      arg: 'successful',
      type: 'boolean',
    },
    description: 'Fire Pwd Change Request for userId',
  });

  Account.remoteMethod('setNewPwd', {
    http: {
      path: '/set-pwd/',
      verb: 'post',
    },
    accepts: {
      arg: 'data',
      type: 'object',
      http: {source: 'body'},
      required: true,
    },
    returns: {
      arg: 'successful',
      type: 'boolean',
    },
    description: 'Change password for user (verification token needed).',
  });

  /****************************************************************************
   **************************** HELPER FUNCTIONS ******************************
   ****************************************************************************/

  /**
   * function randomPassword: create (pseudo)- random password of length num
   *
   * Author: cmc
   *
   * Last Updated: November 26, 2021
   * @param num
   * @returns {string}
   */
  Account.randomPassword = (num) => {
    // eslint-disable-next-line
    const chars = 'qwertzuopü+asdfghjklöä#yxcvbnmQWERTZUIOPÜ+ASDFGHJKLÖÄ#YXCVBNM,.-<>1234567890ß!§$%&/()"\'[]{}=?';
    // console.log(chars.length);
    let pwd = '';
    for (let i = 0; i < num; i++) {
      pwd = pwd + chars[Math.floor(Math.random() * chars.length)];
    }
    // console.log(pwd);
    return pwd;
  };

  /**
   * function renderTemplate: render html string from template
   *
   * Author: cmc
   *
   * Last Updated: December 7, 2021
   * @param {string} src path to ejs template
   * @param {object} params used in the template
   */
  Account.renderTemplate = (src, params) => {
    let text = '';
    ejs.renderFile(
      path.resolve(__dirname, src),
      params,
      (err, resp) => {
        if (err) {
          console.error(err);
          return null;
        }
        text = resp;
      }
    );
    return text;
  };

  /****************************************************************************
   ******************************* REMOTE HOOKS *******************************
   ****************************************************************************/
  /**
   * use: send verification email for promoted user
   *
   * Author: cmc
   *
   * Last Updated: December 13, 2021
   */
  Account.afterRemote(
    'changeRole',
    (ctx, {user: {roleId, principalId}}, next) => {
      console.log(roleId, principalId);
      const {Email, Role} = Account.app.models;
      Role.findOne(
        {where: {id: principalId}},
        (err, role) => {
          console.log(role);
          Account.findOne({where: {id: principalId}}, (err, model) => {
            if (err) console.error(err);
            const html = Account.renderTemplate(
              '../../server/templates/promoted.ejs',
              {username: model.username, role: role.name}
            );
            Email.send({
              type: 'email',
              to: model.email,
              from: process.env.MAIL_FROM,
              subject: 'Your role has changed!',
              host: process.env.FRONTEND_HOST || 'localhost',
              port: process.env.FRONTEND_PORT,
              html: html,
            }, err => {
              if (err) console.error(err);
              next();
            });
          });
        });
    }
  );

  /**
   * use: send verification email for self-registered users
   *
   * Author: cmc
   *
   * Last Updated: December 13, 2021
   */
  Account.afterRemote('createStudent', (ctx, model, next) => {
    // console.log(model);
    const verifyOptions = {
      type: 'email',
      to: model.email,
      from: process.env.MAIL_FROM,
      subject: 'Thanks for registering.',
      host: process.env.FRONTEND_HOST || 'localhost',
      port: process.env.FRONTEND_PORT,
      template: path.resolve(__dirname, '../../server/templates/register.ejs'),
      user: model,
    };
    model.verify(verifyOptions);
    next();
    // model.verify(verifyOptions, (err, response) => {
    //   if (err) {
    //     Account.deleteById(model.id);
    //     return next(err);
    //   }
    //   // console.log(ctx.res);
    //   // console.log(ctx.req);
    //   console.log(response);
    //   // next(response);
    //   next();
    // });
  });

  /**
   * use: send verification password reset
   *
   * Author: cmc
   *
   * Last Updated: December 13, 2021
   */
  // Account.afterRemote('pwdReset', (ctx, model, next) => {
  //   // console.log(model);
  //   const verifyOptions = {
  //     type: 'email',
  //     to: model.email,
  //     from: process.env.MAIL_FROM,
  //     subject: 'Your password has been reset.',
  //     host: process.env.FRONTEND_HOST || 'localhost',
  //     port: process.env.FRONTEND_PORT,
  //     template: path.resolve(__dirname, '../templates/pwd-reset.ejs'),
  //     user: model,
  //   };
  //   model.verify(verifyOptions, (err, response, next) => {
  //     if (err) return next(err);
  //     next();
  //   });
  //   next();
  // });
};
