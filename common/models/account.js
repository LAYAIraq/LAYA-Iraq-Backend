/**
 * Filename: account.js
 * Use: Define additional methods for account data model
 * Creator: core
 * Date: unknown
 */
'use strict';

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
        }, (err, principal) => {
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
   * Function createAuthor: create user in 'author' role
   *
   * Author: core
   *
   * Last Updated: unknown
   *
   * @param {object} user user settings
   * @param {Function} cb callback function
   */
  Account.createAuthor = (user, cb) => {
    const ROLE_NAME = 'author';
    const {Role, RoleMapping} = Account.app.models;

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
        }, (err, principal) => {
          if (err) return cb(err);
          // return new author
          cb(null, newUser);
        });
      });
    });
  };

  /**
   * Use: expose createAuthor to API
   *
   * Author: core
   *
   * Last Updated: unknown
   */
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
    Role.getRoles({principalId: userId}, (err, roles) => {
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
        user.updateAttributes({lang: newlang}, (err, user) => {
          if (err) {
            console.error(err);
            cb(null, false);
          }
          else {
            console.log(`User #${user.id}'s language updated to ${user.lang}`);
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

  Account.afterRemote('createStudent', (ctx, model, next) => {
    console.log(model);
    const addr = model.email;
    Account.sendEmail(addr);
    next();
  });
  // send an email
  Account.sendEmail = (addr, cb) => {
    Account.app.models.Email.send({
      to: addr,
      from: 'laya.noreply@gmail.com',
      subject: 'my subject',
      text: 'my text',
      html: 'my <em>html</em>',
    }, function(err, mail) {
      console.log('email sent!');
      cb(err);
    });
  };
};
