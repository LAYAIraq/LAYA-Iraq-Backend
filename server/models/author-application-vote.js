'use strict';
module.exports = (AuthorApplicationVote) => {
  /**
   * beforeRemote('create'): check if app vote is duplicate
   *
   * Author: cmc
   *
   * Last Updated: April 26, 2022
   */
  AuthorApplicationVote.beforeRemote('create', (ctx, instance, next) => {
    const {editorId, applicationId} = ctx.args.data;
    AuthorApplicationVote.findOne({where: {
      editorId: editorId,
      applicationId: applicationId,
    }}, (err, appVote) => {
      if (err) {
        next(err);
      } else {
        if (appVote) {
          next(new Error('Vote already exists!'));
        } else {
          next();
        }
      }
    });
  });
};
