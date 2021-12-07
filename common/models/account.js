/**
 * Filename: account.js
 * Use: Define additional methods for account data model
 * Creator: core
 * Date: unknown
 */
'use strict';

const path = require('path');
const ejs = require('ejs');
module.exports = (Account) => {
  /**
   * Use: disable default create endpoint
   *
   * Author: core
   *
   * Last Updated: unknown
   */
  Account.disableRemoteMethodByName('create');

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
   * Use: expose existsByName to API
   *
   * Author: core
   *
   * Last Updated: unknown
   */
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
    Account.find({where: {email: email}}, (err, accounts) => {
      if (accounts.length > 0)
        cb(null, true);
      else
        cb(null, false);
    });
  };

  /**
   * Use: expose existsByEmail to API
   *
   * Author: core
   *
   * Last Updated: unknown
   */
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
    const {Role, RoleMapping} = Account.app.models;
    // if (!user.password) {
    //   user.password = Account.randomPassword(16);
    // }
    Account.create(user, (err, newUser) => {
      if (err) return cb(err);

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
   * Use: expose createStudent to API
   *
   * Author: core
   *
   * Last Updated: unknown
   */
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

  /**
   * Function createUser: create user from admin panel
   *
   * Author: core
   *
   * Last Updated: December 7, 2021
   *
   * @param {email, username, role} user new user
   * @param {Function} cb callback function
   */
  Account.createUser = ({email, username, role}, cb) => {
    const {Role, RoleMapping} = Account.app.models;
    const pwd = Account.randomPassword(12);
    // create new user
    Account.create({
      username: username,
      email: email,
      password: pwd,
    }, (err, newUser) => {
      if (err) return cb(null, err);
      else {
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
              from: 'laya-support@informatik.hu-berlin.de',
              subject: 'You have been registered for LAYA',
              template: path.resolve(__dirname, '../../server/views/template-create.ejs'),
              user: newUser,
              host: 'localhost',
              port: '8080',
              pwd: pwd
            };

            newUser.verify(verifyOptions, (err, response, next) => {
              if (err) return next(err);
              next();
            });
          });
        })
      }
    });
  };

  /**
   * Use: expose createUser to API
   *
   * Author: core
   *
   * Last Updated: December 7, 2021
   */
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
    description: 'Create new user with random password'
  });

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
   * Use: expose getRole to API
   *
   * Author: core
   *
   * Last Updated: unknown
   */
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
   * Use: expose changelanguage to API
   *
   * Author: cmc
   *
   * Last Updated: August 19, 2020
   */
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

  /**
   * Function pwdReset: fire password reset for userId
   *
   * Author: cmc
   *
   * Last Updated: November 26, 2021
   * @param userId
   * @param cb callback function to return boolean
   */
  Account.pwdReset = (userId, cb) => {
    Account.findById(userId, (err, user) => {
      if (err) {
        console.error(err);
        cb(null, false);
      } else {
        const pwd = Account.randomPassword(12);
        user.updateAttributes({password: pwd}, (err) => {
          if (err) {
            cb(null, false);
          } else {
            // const ejs = require('ejs');
            let html = Account.renderTemplate(
              '../../server/views/template-pwd-reset.ejs',
              {username: user.username, pwd: pwd}
            );
            console.log(html);
            Account.app.models.Email.send({
              type: 'email',
              to: user.email,
              from: 'laya-support@informatik.hu-berlin.de', // TODO: set variable for support email address
              subject: 'Your new password',
              host: 'localhost', // TODO: set variable for front end host
              port: '8080',
              html: html,
              // pwd: Account.randomPassword(12),
              // // eslint-disable-next-line
              // template: path.resolve(__dirname, '../../server/views/template-pwd-reset.ejs'),
              // user: user,
            }, err => {
              if (err) console.error(err);
              // console.log('sending email');
            });
            cb(null, true);
          }
        });
      }
    });
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
    let html = '';
    ejs.renderFile(
      path.resolve(__dirname, src),
      params,
      (err, resp) => {
        if (err) return null;
        html = resp;
      });
    return html;
  };

  /**
   * Use: expose pwdReset to API
   *
   * Author: cmc
   *
   * Last Updated: November 26, 2021
   */
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
   * function changeRole: change role of given userId
   *
   * Author: cmc
   *
   * Last Updated: November 26, 2021
   * @param data userId: number, role: string
   * @param cb returns roleMapping instance if successful
   */
  Account.changeRole = (data, cb) => {
    const {RoleMapping} = Account.app.models;
    RoleMapping.findOne({where: {principalId: data.userId}}, (err, map) => {
      if (err) {
        const error = new Error(`No user with id ${data.userId} found!`);
        error.status = 404;
        cb(error);
      }
      RoleMapping.findOne({where: {principalId: data.role}},
        (err, roleMap) => {
          if (err) {
            // console.error(`No role ${data.role} found!`);
            const error = new Error('No role ${data.role} found!');
            error.status = 404;
            cb(error);
          }
          if (!roleMap) {
            const error = new Error('No such role found!');
            error.status = 404;
            cb(error);
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
    });
  };

  /**
   * use: expose changeRole to API
   *
   * Author: cmc
   *
   * Last Updated: November 26, 2021
   */
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

  Account.afterRemote('createStudent', (ctx, model, next) => {
    console.log(model);
    const verifyOptions = {
      type: 'email',
      to: model.email,
      from: 'laya-support@informatik.hu-berlin.de', // TODO: set variable for support email address
      subject: 'Thanks for registering.',
      host: 'localhost', // TODO: set variable for front end host
      port: '8080',
      template: path.resolve(__dirname, '../../server/views/template.ejs'),
      user: model,
    };
    model.verify(verifyOptions, (err, response, next) => {
      if (err) return next(err);
      console.log('> verification email sent:', response);
      // next();
    });
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

  // Method to render FIXME: seems to never be called
  Account.afterRemote('prototype.verify', (ctx, model, next) => {
    const user = ctx.req.remotingContext.instance;
    console.log('> after verify hook');
    const verifyOptions = {
      type: 'email',
      to: user.email,
      from: 'laya-support@informatik.hu-berlin.de', // TODO: set variable for support email address
      subject: 'Your new verification link.',
      host: 'localhost', // TODO: set variable for front end host
      port: '8080',
      template: path.resolve(__dirname, '../../server/views/template.ejs'),
      user: user,
    };
    user.verify(verifyOptions, (err, response, next) => {
      if (err) return next(err);
      // console.log('> verification email sent:', response);
      // next();
    });
    next();
  });
};
