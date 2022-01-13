/**
 * Filename: enrollment.js
 * Use: Declare functions for enrollment data model
 * Creator: cmc
 * Date: September 23, 2020
 */

'use strict';

module.exports = (Enrollment) => {
  // const app = require('../server');

  // legacy function
  Enrollment.observe('before save', (ctx, next) => {
    // const Course = app.models.Course;
    // if (ctx.instance !== undefined) {
    //   ctx.instance.position.get().then(function(d) {
    //     if (d === undefined) {
    //       let c = Course.find(ctx.courseId)
    //       console.log(c.startInteraction)
    //       ctx.instance.position = c.startInteraction
    //     }
    //   })
    // }
    next();
  });

  /**
   * Function createEnrollment: creates Enrollment if it doesn't exist,
   *  returns existing otherwise
   *
   * Author: cmc
   *
   * Last Updated: June 16, 2021
   * @param {object} data studentId, courseId
   * @param {Function} cb callback function
   */
  Enrollment.createEnrollment = (data, cb) => {
    const sid = data.studentId;
    const cid = data.courseId;

    Enrollment.findOrCreate({where: {studentId: sid, courseId: cid}},
      {studentId: sid, courseId: cid, created: Date.now()},
      (err, newEnrollment) => {
        if (err) {
          console.error(err);
          return cb(err);
        }
        else {
          const {Notification} = Enrollment.app.models;
          Notification.newSubscriber({
            studentId: sid,
            courseId: cid,
          });
          cb(null, newEnrollment);
        }
      });
  };

  /**
   * Use: expose createEnrollment to API
   *
   * Author: cmc
   *
   * Last Updated: September 23, 2020
   */
  Enrollment.remoteMethod('createEnrollment', {
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
      arg: 'enrol',
      type: 'Enrollment',
    },
    description: 'Checks if Mapping exists, updates if yes, creates if no',
  });

  /**
   * Function getAllByStudentId: returns a List of Courses that User is Enrolled in
   *
   * Author: cmc
   *
   * Last Updated: September 23, 2020
   *
   * @param {number} userId id of user
   * @param {Function} cb callback function
   */
  Enrollment.getAllByStudentId = (userId, cb) => {
    Enrollment.find({where: {studentId: userId}}, (err, list) => {
      if (err) return cb(null, err);
      else return cb(null, list);
    });
  };

  /**
   * Use: expose getAllByStudentId to API
   *
   * Author: cmc
   *
   * Last Updated: September 23, 2020
   */
  Enrollment.remoteMethod('getAllByStudentId', {
    http: {
      path: '/getAllByStudentId',
      verb: 'get',
    },
    accepts: {
      arg: 'uid',
      type: 'any',
      required: true,
    },
    returns: {
      arg: 'sublist',
      type: 'array',
    },
    description: 'Get all Enrollments of user by User ID',
  });

  /**
   * Function getCourseEnrollments: returns a List all enrollements of a course
   *
   * Author: cmc
   *
   * Last Updated: September 23, 2020
   *
   * @param {string} cid id of course
   * @param {Function} cb callback function
   */
  Enrollment.getCourseEnrollments = (cid, cb) => {
    Enrollment.find({where: {courseId: cid}}, (err, list) =>{
      console.log(list);
      if (err) return cb(null, err);
      else return cb(null, list);
    });
  };

  /**
   * Use: expose getCourseEnrollments to API
   *
   * Author: cmc
   *
   * Last Updated: September 23, 2020
   */
  Enrollment.remoteMethod('getCourseEnrollments', {
    http: {
      path: '/getAllByCourseId',
      verb: 'get',
    },
    accepts: {
      arg: 'courseId',
      type: 'any',
      required: true,
    },
    returns: {
      arg: 'subs',
      type: 'array',
    },
    description: 'Returns a list of enrollments for a Course',
  });

  /**
   * Function getEnrollment: checks if a Mapping exists, returns it if yes
   *  (Does the same as findOne)
   *
   * Author: cmc
   *
   * Last Updated: September 23, 2020
   *
   * @param {object} data studentId, courseId
   * @param {Function} cb callback function
   */
  Enrollment.getEnrollment = (data, cb) => {
    const sid = data.studentId;
    const cid = data.courseId;
    if (sid == null || cid == null) {
      return cb(null, {});
    }

    Enrollment.find({where: {studentId: sid, courseId: cid}}, (err, enrol) => {
      if (err) {
        console.error(err);
        return cb(err);
      }
      else {
        console.log(enrol);
        return cb(null, enrol[0]);
      }
    });
  };

  /**
   * Use: expose getEnrollment to API
   *
   * Author: cmc
   *
   * Last Updated: September 23, 2020
   */
  Enrollment.remoteMethod('getEnrollment', {
    http: {
      path: '/getEnrollment',
      verb: 'get',
    },
    accepts: {
      arg: 'data',
      type: 'object',
      http: {source: 'body'},
      required: true,
    },
    returns: {
      arg: 'enrol',
      type: 'Enrollment',
    },
    description: 'Get an Enrollment by User ID and Course Name',
  });
};
