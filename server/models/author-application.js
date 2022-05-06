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

  /**
   * function decideOnApplication: set status and decidedOn
   *
   * Author: cmc
   *
   * Last Updated: May 6, 2022
   * @param id id of application
   * @param decidedOn date of decision
   * @param status one of 'accepted', 'refused', 'withdrawn'
   * @param cb callback
   */
  AuthorApplication.decideOnApplication = (id, {decidedOn, status}, cb) => {
    AuthorApplication.findById(id, (err, application) => {
      if (err) {
        cb(err);
      } else if (application) {
        if (application.status) { // application already decided
          const err = new Error('Application already decided!');
          err.status = 403;
          cb(err);
        } else if (status !== 'withdrawn' &&
          status !== 'accepted' &&
          status !== 'refused') { // reject if decision has wrong value
          const err = new Error('Wrong decision string!');
          err.status = 403;
          cb(err);
        } else {
          application.updateAttributes({
            decidedOn: decidedOn,
            status: status,
          });
          cb(null, application);
        }
      } else {
        const err = new Error('Application doesn`t exist!');
        err.status = 404;
        cb(err);
      }
    });
  };

  /**
   * function editApplication: change properties, save old input in edited
   *
   * Auhtor: cmc
   *
   * Last Updated: May 5, 2022
   * @param id id of application
   * @param data whole application data
   * @param cb callback
   */
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

  AuthorApplication.remoteMethod('decideOnApplication', {
    http: {
      path: '/:id/decide',
      verb: 'patch',
    },
    accepts: [{
      arg: 'id',
      type: 'string',
      required: true,
    }, {
      arg: 'data',
      type: 'object',
      http: {source: 'body'},
      required: true,
    }],
    returns: {
      arg: 'decidedApplication',
      type: 'AuthorApplication',
    },
    description: 'Set status and decidedOn, reject if already decided.',
  });

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
