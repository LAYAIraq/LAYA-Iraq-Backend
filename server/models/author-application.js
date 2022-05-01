'use strict';
module.exports = (AuthorApplication) => {
  /**
   * beforeRemote('create'): check if application for user already exists
   *
   * Author: cmc
   *
   * Last Updated: May 1, 2022
   */
  AuthorApplication.beforeRemote('create', (ctx, instance, next) => {
    AuthorApplication.findOne({where: {
      applicantId: ctx.args.data.applicantId,
    }}, (err, application) => {
      if (err) {
        next(err);
      } else {
        if (application) {
          const error = new Error('User has already sent an application!');
          error.status = 403;
          next(error);
        } else {
          next();
        }
      }
    });
  });
};
