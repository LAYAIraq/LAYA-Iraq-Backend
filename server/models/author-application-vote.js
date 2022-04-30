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
      path: '/:id/updateVote',
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
