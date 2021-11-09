/**
 * Filename: 99-test.js
 * Use: Create a sample course and test user
 * Creator: cmc
 * Date: August 19, 2020
 */
/* eslint-disable */
'use strict';

const sampleCourse = require('./sample-courses/sample-course-short.json')
const sampleCourseSimple = require('./sample-courses/sample-course-simple.json')

module.exports = function(server) {
  let {Account, Role, Flag, RoleMapping, Course} = server.models;

  // test account
  Account.findOrCreate({where: {email: 'test@laya'}}, {
    email: 'test@laya',
    username: 'test',
    password: 'test',
  }, (err, test) => {
    if (err) {
      return console.error(err);
    }

  // Set Role
    Role.findOrCreate({where: {name: 'test'}}, {
    name: 'test',
    }, (err, role) =>
    {
      if (err) {
        return console.error(err);
      }

      role.principals.find({
        where: {principalId: test.id},
      }, (err, principals) => {
        if (err) {
          return console.error(err);
        }

        // create if needed
        if (principals.length === 0) {
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: test.id,
          }, (err, principal) => {
            if (err) {
              return console.error(err);
            }
            return console.log('Test Role Principal created:', principal);
          });
        }
        if (principals.length === 1) {
          return console.log('Test Role Principal exists');
        }
        if (principals.length > 1) {
          throw 'Multiple Test Role Principals exist!';
        }
      });
    });
  });

  Account.find({ where: { username: 'admin' } }, (err, userList) =>
  {
    if (err) console.error(err);
    console.log(userList)
    // const adminId = userList[0]['id'];
    // console.log('Admin is id: ', userList[0] )
    // Test Course
    Course.findOrCreate({
      where: {
        name: 'Testkurs',
        category: 'Kurs'
      }
    },
    sampleCourse, (err) => {
    if (err) return console.error(err);
    console.log('Sample Course exists');
  });

    // second test course
    Course.findOrCreate({ where: { name: 'Testkurs - Tooltips', category: 'Descriptions' } },
      sampleCourseSimple, (err) => {
      if (err) return console.error(err);
      console.log('Sample Course with Simple Language exists');
    });

    //  mockup flag
    Flag.findOrCreate({
      where: {
        courseId: 't3stkur5simp',
        authorId: 1
      }
    }, {
      created: Date.now(),
      referenceId: 't3stfl4g',
      question: {
        text: 'Was ist das hier für ein Spasz?',
        edited: false,
        editTime: null
      },
      courseId: 't3stkur5s1mp',
      authorId: 1,
      enrollmentId: null,
      answers: [
        {
          'text': 'Sample Answer',
          'authorId': 42,
          'timestamp': Date.now(),
          'score': 1
        }
      ]
    }, err => {
      if (err) console.error(err);
      else console.log('Mockup flag exists');
    });
  });

  //mockup enrollment removed
};
