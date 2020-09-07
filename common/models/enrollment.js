'use strict';

module.exports = function(Enrollment) {
  let app = require('../../server/server');

  Enrollment.observe('before save', function(ctx, next) {
    let Course = app.models.Course;
    // if (ctx.instance !== undefined) {
    //   ctx.instance.position.get().then(function(d) {
    //     if (d === undefined) {
    //       let c = Course.find(ctx.courseId);
    //       console.log(c.startInteraction);
    //       ctx.instance.position = c.startInteraction;
    //     }
    //   });
    // }
    next();
  });

  // returns a List of all Course Names that the User is Enrolled in
  Enrollment.getAllByStudentId = (userId, cb) => {
    
    Enrollment.find({where: {studentId: userId}}, (err, list)  => {
      var subs = []
      if (err) console.log(err)
      else {
        for(const sub of list) {
          subs.push(sub.courseId)
        }
      }
      //const data = {subs}
      cb(null, subs)
    })
    
  }

  Enrollment.remoteMethod('getAllByStudentId', {
    http: {
      path: '/getAllByStudentId',
      verb: 'get',
    },
    accepts: { 
      arg: 'uid',
      type: 'any',
      //http: {source: 'body'},
      required: true
    },
    returns: {
      arg: 'subList',
      type: 'object'
    },
    description: 'Get all Enrollments of user by User ID'
  })
  
};
