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

  AuthorApplication.editApplication = (id, data, cb) => {
    AuthorApplication.findById(id, (err, application) => {
      if (err) {
        cb(err);
      } else if (application) {
        const editedData = {
          editTime: Date.parse(application.lastEdited),
          areaOfExpertise:
            application.areaOfExpertise === data.areaOfExpertise ?
              null : application.areaOfExpertise,
          applicationText:
            application.applicationText === data.applicationText ?
              null : application.applicationText,
          fullName: application.fullName === data.fullName ?
            null : application.fullName,
          institution: application.institution === data.institution ?
            null : application.institution,
        };
        Object.keys(editedData).forEach(
          (k) =>
            editedData[k] == null && delete editedData[k]
        ); // strip null values from editedData
        console.log(editedData);
        application.updateAttributes({
          areaOfExpertise: editedData.areaOfExpertise ?
            data.areaOfExpertise : application.areaOfExpertise,
          applicationText: editedData.applicationText ?
            data.applicationText : application.applicationText,
          edited: application.edited ?
            [... application.edited, editedData] : [editedData],
          fullName: editedData.fullName ?
            data.fullName : application.fullName,
          institution: editedData.institution ?
            data.institution : application.institution,
          lastEdited: Date.now(),
        });
        cb(null, application);
      } else {
        const err = new Error('Application doesn`t exist!');
        err.status = 404;
        cb(err);
      }
    });
  };

  AuthorApplication.remoteMethod('editApplication', {
    http: {
      path: '/:id/edit',
      verb: 'patch',
    },
    accepts: [{
      arg: 'id',
      type: 'string',
      required: true,
    }, {
      arg: 'newApplication',
      type: 'object',
      http: {source: 'body'},
      required: true,
    }],
    returns: {
      arg: 'editedApplication',
      type: 'AuthorApplication',
    },
    description: 'Update the application, save edits in edited.',
  });
};
