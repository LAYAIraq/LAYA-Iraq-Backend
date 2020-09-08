'use strict';

module.exports = (Enrollment) => {
  let app = require('../../server/server');

  //legacy function
  Enrollment.observe('before save', (ctx, next) => {
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

  //creates Enrollment if it doesn't exist, returns existing otherwise
  Enrollment.createEnrollment = (data, cb) => {
    let sid = data.studentId
    let cid = data.courseId

    Enrollment.findOrCreate({where: {studentId: sid, courseId: cid}}, 
      {studentId: sid, courseId: cid, created: Date.$now}, 
      (err, newEnrollment, isNewInstance) => {
        // if(isNewInstance) console.log("New Instance of Enrollment!")
        // else console.log("Instance has existed beforedoing nothing...")
        if (err) {
          console.error(err)
          return cb(err)
        }
        else { 
          // console.log("New User:")
          // console.log(newEnrollment)
          cb(null, newEnrollment)
        }
    })

  }

  Enrollment.remoteMethod('createEnrollment', {
    http: {
      path: '/create',
      verb: 'post',
    },
    accepts: { 
      arg: 'data',
      type: 'object',
      http: {source: 'body'},
      required: true
    },
    returns: {
      arg: 'enrol',
      type: 'Enrollment'
    },
    description: 'Checks if Mapping exists, updates if yes, creates if no'
  })


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

  //checks if a Mapping exists, returns it if yes

  Enrollment.getEnrollment = (data, cb) => {
    console.log("Trying to find an Enrollment")
    console.log(data)
    let sid = data.studentId
    let cid = data.courseId
    if (sid == null || cid == null) {
      console.log("Empty Object in request!")
      return cb(null, {})
    }

    Enrollment.find({where: {studentId: sid, courseId: cid}}, (err, enrol) => {
      if (err){
        console.error(err)
        return cb(err)
      } 
      else {
        console.log(enrol)
        return cb(null, enrol[0])
      }
    })

  }

  Enrollment.remoteMethod('getEnrollment', {
    http: {
      path: '/getEnrollment',
      verb: 'get',
    },
    accepts: { 
      arg: 'data',
      type: 'object',
      http: {source: 'body'},
      required: true
    },
    returns: {
      arg: 'enrol',
      type: 'Enrollment'
    },
    description: 'Get an Enrollment by User ID and Course Name'
  })
  
};
