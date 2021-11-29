/**
 * Filename: 06-test-courses.js
 * Use: Create sample courses and mockup flag
 * Creator: cmc
 * Date: August 19, 2020
 */
'use strict';

const sampleCourse = require('./sample-courses/sample-course-short.json');
const sampleCourseSimp = require('./sample-courses/sample-course-simple.json');

module.exports = function(server) {
  const {Flag, Course} = server.models;

    // Test Course
  Course.findOrCreate({
    where: {
      name: 'Testkurs',
      category: 'Kurs',
    },
  },
  sampleCourse, (err) => {
    if (err) return console.error(err);
    console.log('Sample Course exists');
  });

    // second test course
  Course.findOrCreate({
    where: {
      name: 'Testkurs (Simple Language)',
      category: 'Kurs',
    }},
    sampleCourseSimp, (err) => {
      if (err) return console.error(err);
      console.log('Sample Course with Simple Language exists');
    });

    //  mockup flag
  Flag.findOrCreate({
    filter: {
      where: {
        courseId: 't3stkur5simp',
        referenceId: '99test001',
        authorId: 1,
      }}},
    {
      created: Date.now(),
      referenceId: '99test001',
      question: {
        text: 'Sample Question?',
        edited: false,
        editTime: null,
      },
      courseId: 't3stkur5s1mp',
      authorId: 1,
      enrollmentId: null,
      answers: [
        {
          'text': 'Sample Answer',
          'authorId': 42,
          'timestamp': Date.now(),
          'score': 1,
        },
      ],
    }, (err) => {
      if (err) console.error(err);
      else console.log('Mockup flag exists');
    });
};
