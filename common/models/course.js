/**
 * Filename: course.js
 * Use: Declare functions for course data model
 * Creator: core
 * Date: unknown
 */

'use strict'

module.exports = function(Course) {
    let app = require('../../server/server')

    // returns a the uuid for a course

    /**
     * Function getCourseId: return the ID of the course
     * 
     * Author: cmc
     * 
     * Last Updated: February 6, 2021
     * @param {string} courseName name of the course
     * @param {Function} cb callback function
     */
    Course.getCourseId = (courseName, cb) => {
    
        Course.find({ where: { name: courseName } }, (err, list)  => {
            if (list.length > 1) console.log('Not a unique Course Name!')
            if (err) return cb(null, err)
            else return cb(null, list[0].courseId)
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
}
