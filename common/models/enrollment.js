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
};
