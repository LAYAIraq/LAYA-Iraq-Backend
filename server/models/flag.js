/**
 * Filename: flag.js
 * Use: Declare functions for flag data model
 * Creator: cmc
 * Date: September 10, 2020
 */

'use strict';

module.exports = (Flag) => {
  // const app = require('../../server/server');

  /**
   * Function addNew: Add new Flag
   *
   * Author: cmc
   *
   * Last Updated: August 31, 2021
   * @param {object} data Flag data
   * @param cb return function
   */
  Flag.addNew = (data, cb) => {
    Flag.create({...data}, (err, model) => {
      if (err) cb(null, err);
      const {Notification} = Flag.app.models;
      Notification.newFlag(model);
      cb(null, model);
    });
  };

  /**
   * afterRemote create: make notification for new flag
   *
   * Author: cmc
   *
   * Last Updated: September 19, 2021
   */
  Flag.afterRemote('create', (ctx, model, next) => {
    const {Notification} = Flag.app.models;
    Notification.newFlag(model);
    next();
  });

  /**
   * Use: expose addNew to the API
   *
   * Author: cmc
   *
   * Last Updated: August 31, 2021
   */
  Flag.remoteMethod('addNew', {
    http: {
      path: '/create',
      verb: 'post',
    },
    accepts: {
      arg: 'data',
      type: 'object',
      http: {source: 'body'},
      required: true,
    },
    returns: {
      arg: 'flag',
      type: 'Flag',
    },
    description: 'Creates a new flag and a notification',
  });

  /**
   * Function updateFlag: update a flag instance, create notification
   *  for new answers
   *
   * Author: cmc
   *
   * Last Updated: September 19, 2021
   * @param {object} data flag data to update
   * @param {function} cb callback
   */
  Flag.updateFlag = (data, cb) => {
    Flag.upsert(data, (err, model) => {
      if (err) {
        console.error(err);
        cb(null, err);
      }
      const {Notification} = Flag.app.models;
      model.answers.forEach(answer => { // run upsert for all answers
        Notification.upsertAnswer(
          data.referenceId,
          data.authorId,
          data.courseId,
          answer
        );
      });
      cb(null, model);
    });
  };

  /**
   * Use: expose updateFlag to API
   *
   * Author: cmc
   *
   * Last Updated: September 2, 2021
   */
  Flag.remoteMethod('updateFlag', {
    http: {
      path: '/updateFlag',
      verb: 'post',
    },
    accepts: {
      arg: 'data',
      type: 'object',
      http: {source: 'body'},
      required: true,
    },
    returns: {
      arg: 'flag',
      type: 'Flag',
    },
    description: 'Updates Flag instance and runs for new answer notifications.',
  });
};
