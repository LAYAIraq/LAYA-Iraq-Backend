"use strict";

const base = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role']
const custom = ['Account', 'AssessmentScmc', 'Course', 'CourseQuiz', 'CourseQuizContent',
  'CourseTopic', 'CourseTopicContent', 'Enrollment', 'Flag', 'Learninteraction']

module.exports = function(app, cb) {
  const { sqlite } = app.dataSources;
  const models = [].concat(base, custom)

  sqlite.isActual(models, (err, actual) => {

    let syncStatus = actual? 'in Sync with Database Model' : 'out of Sync with Database Model'
    console.log(`Database tables are ${syncStatus}`)
    
    if (actual) {
        cb();
    } 
    else {
      console.log('Updating Database...')
      sqlite.autoupdate(models, (err, result) => {
        if (err) throw err
        console.log('\nUpdating database completed!')
      })
      cb();
    }
  });
};
