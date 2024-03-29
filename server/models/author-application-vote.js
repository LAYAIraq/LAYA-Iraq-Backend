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
          const error = new Error('Vote already exists!');
          error.status = 403;
          next(error);
        } else {
          next();
        }
      }
    });
  });

  /**
   * afterRemote('create'): check if application reached threshold
   *  to be accepted
   *
   *  Author: cmc
   *
   *  Last Updated: May 14, 2022
   */
  AuthorApplicationVote.afterRemote('create', (ctx, instance, next) => {
    // console.log('checking in 10 minutes if to approve the application...');
    const approve = () => {
      const {AuthorApplication} = AuthorApplicationVote.app.models;
      AuthorApplicationVote.find(
        {where: {applicationId: instance.applicationId}},
        (err, list) => {
          if (err) {
            console.error(err);
          }
          const approvedList = list.filter(e => e.vote === true);
          if (approvedList.length >= 3) {
            AuthorApplication.findOne({where: {id: instance.applicationId}},
              (err, app) => {
                if (err) {
                  console.error(err);
                } else {
                  app.updateAttributes({
                    decidedOn: Date.now(),
                    status: 'accepted',
                  });
                }
              });
          }
        });
    };
    setTimeout(approve, 600000);
    next();
  });

  /**
   * updateVote: change vote, push old decision to edited, update date
   *
   * Author: cmc
   *
   * Last Updated: April 30, 2022
   * @param {string} id vote ID
   * @param {boolean} newVote updated vote
   * @param cb callback
   */
  AuthorApplicationVote.updateVote = (id, newVote, cb) => {
    AuthorApplicationVote.findById(id, (err, instance) => {
      if (err) {
        // console.error(err);
        cb(err);
      } else if (!instance) {
        const error = new Error('No Vote with this ID!');
        error.status = 404;
        cb(error);
      } else {
        // console.log(instance);
        if (!instance.edited) {
          instance.edited = [];
        }
        const oldVote = {
          date: instance.date,
          vote: instance.vote,
        };
        // console.log(oldVote);
        instance.updateAttributes({
          edited: [...instance.edited, oldVote],
          date: Date.now(),
          vote: newVote,
        }, (err, newInstance) => {
          // console.log(newInstance);
          if (err) {
            cb(err);
          } else {
            cb(null, newInstance);
          }
        });
      }
    });
  };

  // expose updateVote to API
  AuthorApplicationVote.remoteMethod('updateVote', {
    http: {
      path: '/:id/update-vote',
      verb: 'patch',
    },
    accepts: [{
      arg: 'id',
      type: 'string',
      required: true,
    }, {
      arg: 'newVote',
      type: 'boolean',
      required: true,
    }],
    returns: {
      arg: 'editorVote',
      type: 'AuthorApplicationVote',
    },
    description: 'Update the vote, save older vote in edited.',
  });
};
