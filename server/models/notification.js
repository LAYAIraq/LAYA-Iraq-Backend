/**
 * Filename: notification.js
 * Use: Declare functions for notification data model
 * Creator: cmc
 * Date: May 26, 2021
 */
'use strict';

module.exports = (Notification) => {
  /**
   * Function newSubscriber: create Notification for new subscriber
   *
   * Author: cmc
   *
   * Last Updated: August 31, 2021
   * @param {object} data notification data
   */
  Notification.newSubscriber = (data) => {
    const {Course} = Notification.app.models;
    Course.findOne({
      where: {courseId: data.courseId},
      fields: {authorId: true},
    },
    (err, courseEntry) => {
      if (err) console.error(err);
      const newData = {
        userId: courseEntry.authorId,
        data: data,
        type: 'authorNewSub'};
      Notification.create(newData, (err, newNote) => {
        console.log(newData);
        if (err) console.error(err);
        else return newNote;
      });
    });
  };

  /**
   * Function newFlag: create Notification for new flag
   *
   * Author: cmc
   *
   * Last Updated: August 31, 2021
   * @param {object} data notification data
   */
  Notification.newFlag = (data) => {
    const {Course} = Notification.app.models;
    Course.findOne({
      where: {courseId: data.courseId},
      fields: {authorId: true},
    },
      (err, courseEntry) => {
        if (err) console.error(err);
        const newData = {
          userId: courseEntry.authorId,
          data: {
            referenceId: data.referenceId,
            question: data.question,
            courseId: data.courseId,
            studentId: data.authorId,
          },
          type: 'authorNewFlag'};
        Notification.create(newData, (err) => {
          if (err) console.error(err);
        });
      });
  };

  /**
   * Function upsertAnswer: if none exists, add notification for a flag
   *   answer
   *
   * Author: cmc
   *
   * Last Updated: September 2, 2021
   * @param refId flag referenceId
   * @param studId id of flag question creator
   * @param cId id of course
   * @param answer answer object of flag
   */
  Notification.upsertAnswer = (refId, studId, cId, answer) => {
    Notification.find({
      fields: {
        type: true,
        data: true,
      },
      where: {
        type: 'studentNewFlagAnswer',
        userId: studId,
      },
    }, (err, instances) => {
      if (err) console.error(err);
      let noted = false;
      instances.forEach(note => {
        if (note.data.referenceId === refId) {
          noted = true;
        }
      });
      if (!noted) {
        // console.log('creating new studentNewFlagAnswer notifitcation!');
        Notification.create({
          userId: studId,
          type: 'studentNewFlagAnswer',
          data: {
            referenceId: refId,
            courseId: cId,
            answer: answer.text,
          },
        }, (err) => {
          if (err) console.error(err);
        });
      }
    });
  };
};
