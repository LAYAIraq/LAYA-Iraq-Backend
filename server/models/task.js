/**
 * Filename: Task.js
 * Use: Declare functions for Task data model
 * Creator: cmc
 * Date: September 23, 2020
 */

'use strict';

module.exports = (Task) => {
  // const app = require('../server');

  // legacy function
  Task.observe('before save', (ctx, next) => {
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
  Task.createTask = (data, cb) => {
    const text = data.freetext;
    const grade = data.freetextGrade;
    const sid = data.studentId;
    const cid = data.courseId;
    const aid = data.assessmentId;

    Task.findOrCreate(
      {where: {studentId: sid, assessmentId: aid},
        order: 'created DESC', limit: 1},
      {studentId: sid, assessmentId: aid, created: Date.now()},
      (err, newTask) => {
        if (err) {
          console.error(err);
          return cb(err);
        }
        else {
          console.log(newTask);
          console.error('creates of found');
          cb(null, newTask);
        }
      });
  };

  /**
   *
   * @param {number} taskId studentId, courseId
   * @param {Function} cb callback function
   */
  Task.getTask = (taskId, cb) => {
    const tid = taskId;
    if (tid == null) {
      return cb(null, {});
    }
    console.log(tid);
    Task.find({where: {taskId: tid}}, (err, enrol) => {
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
   *
   * @param {object} data studentId, courseId, taskId
   * @param {Function} cb callback function
   */
  Task.getSpecificTask = (data, cb) => {
    const sid = data.studentId;
    const cid = data.courseId;
    const tid = data.taskId;
    const aid = data.assessmentId;
    console.log(tid);
    /**
    Task.destroyAll((err) => {
      if (err) {
        console.error('Error deleting entries:', err);
        // Handle error
      } else {
        console.log('Entries deleted successfully');
        // Handle success
      }
    }); */
    Task.find({where: {studentId: sid, assessmentId: aid}}, (err, task) => {
      if (err) {
        console.error(err);
        console.log('err found---------------------------------------');
        return cb(err);
      }
      else {
        console.log('task found---------------------------------------');
        console.log(task[0]);
        if (!task[0]) {
          console.log(' no task');
        }
        return cb(null, task[0]);
      }
    });
  };

  /**
   *
   * @param {object} data studentId, courseId, taskId
   * @param {Function} cb callback function
   */
  Task.deleteAll = (data, cb) => {
    Task.destroyAll((err) => {
      if (err) {
        console.error('Error deleting entries:', err);
        // Handle error
      } else {
        console.log('Entries deleted successfully');
        // Handle success
      }
    });
  };

  /**
   */
  Task.remoteMethod('getSpecificTask', {
    http: {
      path: '/getSpecificTask',
      verb: 'get',
    },
    accepts: {
      arg: 'data',
      type: 'object',
      http: {source: 'body'},
      required: true,
    },
    returns: {
      arg: 'subs',
      type: 'Task',
    },
    description: 'Get an Task by User ID and Course Name',
  });

  /**
   */
  Task.remoteMethod('getTask', {
    http: {
      path: '/getTask/:id',
      verb: 'get',
    },
    accepts: {
      arg: 'data',
      type: 'number',
      http: {source: 'body'},
      required: true,
    },
    returns: {
      arg: 'task',
      type: 'array',
    },
    description: 'Get an Task by User ID and Course Name',
  });

  /**
   *
   * @param {object} data studentId, courseId, taskId
   * @param {Function} cb callback function
   */
  Task.getAllByCourseId = (data, cb) => {
    const cid = data.courseId;
    const aid = data.assessmentId;
    /**
    Task.destroyAll((err) => {
      if (err) {
        console.error('Error deleting entries:', err);
        // Handle error
      } else {
        console.log('Entries deleted successfully');
        // Handle success
      }
    }); */
    Task.find({where: {courseId: cid, assessmentId: aid}}, (err, task) => {
      if (err) {
        console.error(err);
        console.log('err found---------------------------------------');
        return cb(err);
      }
      else {
        console.log('tasks found---------------------------------------');
        console.log(task[0]);
        if (!task[0]) {
          console.log(' no task');
        }
        return cb(null, task);
      }
    });
  };
  /**
   */
  Task.remoteMethod('getAllByCourseId', {
    http: {
      path: '/getAllByCourseId',
      verb: 'get',
    },
    accepts: {
      arg: 'data',
      type: 'object',
      http: {source: 'body'},
      required: true,
    },
    returns: {
      arg: 'subs',
      type: 'array',
    },
    description: 'Returns a list of Task for a Task in a Course',
  });
  /**
   */
  Task.remoteMethod('deleteAll', {
    http: {
      path: '/deleteAll',
      verb: 'post',
    },
    accepts: {
      arg: 'data',
      type: 'number',
      http: {source: 'body'},
      required: true,
    },
    returns: {
      arg: 'task',
      type: 'Task',
    },
    description: 'Get an Task by User ID and Course Name',
  });

  /**
   * Use: expose createTask to API
   *
   * Author: cmc
   *
   * Last Updated: September 23, 2020
   */
  Task.remoteMethod('createTask', {
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
      arg: 'subs',
      type: 'array',
    },
    description: 'Checks if Mapping exists, updates if yes, creates if no',
  });
};
