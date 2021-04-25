
/**
 * Filename: 02-update-sqlite-schema.js
 * Use: Updated database tables before starting loopback
 * Creator: core
 * Date: unknown
 */
'use strict'

// all data tables
const base = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role']
const custom = ['Account', 'AssessmentScmc', 'Course', 'CourseQuiz', 'CourseQuizContent',
  'CourseTopic', 'CourseTopicContent', 'Enrollment', 'Flag', 'Learninteraction']

module.exports = (app, cb) => {
  const { sqlite } = app.dataSources
  const models = [].concat(base, custom)

  // check if table schemes are up to date
  sqlite.isActual(models, (err, actual) => {

    let syncStatus = actual? 'in Sync with Database Model' : 'out of Sync with Database Model'
    console.log(`Database tables are ${syncStatus}`)
    
    if (actual) {
        cb()
    } 
    // update if they aren't
    else {
      console.log('Updating Database...')
      sqlite.autoupdate(models, (err, result) => {
        if (err) throw err
        console.log('\nUpdating database completed!')
      })
      cb()
    }
  })
}
