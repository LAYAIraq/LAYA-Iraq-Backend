/**
 * Filename: course.js
 * Use: Declare functions for course data model
 * Creator: core
 * Date: unknown
 */

'use strict'

module.exports = function(Course) {

  // returns a the uuid for a course

  /**
   * Function getCourseId: return the ID of the course 
   *  or 404 if not found
   * 
   * Author: cmc
   * 
   * Last Updated: April 21, 2021
   * @param {string} courseName name of the course
   * @param {Function} cb callback function
   */
  Course.getCourseId = (courseName, cb) => {
  
    Course.find({ where: { name: courseName } }, (err, list)  => {
      if (list.length > 1) console.log('Not a unique Course Name!')
      if (err) return cb(null, err)
      if(list.length != 0) return cb(null, list[0].courseId)
      else {
        let error = new Error('Course Name not Found!')
        error.status = 404
        return cb(error)
      }
    })
  }

  /**
   * Use: expose getCourseId to the API
   * 
   * Author: cmc
   * 
   * Last Updated: February 6, 2021
   */
  Course.remoteMethod('getCourseId', {
    http: {
      path: '/getCourseId',
      verb: 'get',
    },
    accepts: { 
      arg: 'courseName',
      type: 'string',
      required: true
    },
    returns: {
      arg: 'courseId',
      type: 'string'
    },
    description: 'Get the uuid for a Course.'
  })

  /**
   * Function updateFiles: Update Course File List
   * 
   * Author: cmc
   * 
   * Last Updated: April 21, 2021
   * 
   * @param {array} newFiles the new file list
   * @param {function} cb callback function
   */
  Course.updateFiles = (id, newFiles, cb) => {
    console.log('We received this: id - ', id, 'filelist: ', newFiles)
    Course.findById(id, (err, course) => {
      if (err) {
        let error = new Error(err)
        error.status = 400
        cb(error, 'Course not found')
      }
      else {
        course.updateAttributes({ files: newFiles}, (err, course) => {
          if (err) {
            let error = new Error(err)
            error.status = 400
            cb(error)
          }
          else {
            cb(null, course)
          }
        })
      }
    })
  }

  Course.remoteMethod('updateFiles', {
    http: {
      path: '/:id/update-files',
      verb: 'post',
    },
    accepts: [
      {
        arg: 'id',
        type: 'string',
        required: true
      },
      {
        arg: 'newFiles',
        type: 'array',
        http: {source: 'body'},
        required: true
      }
    ],
    returns: {
      root: true,
      type: 'boolean'
    },
    description: 'Update the Course Files'
  })
}
