/**
 * Filename: 99-test.js
 * Use: Create a sample course and test user
 * Creator: cmc
 * Date: August 19, 2020
 */
/* eslint-disable */
'use strict';

// import * as sampleCourse from '../../common/samplecourse.json'

module.exports = function(server) {
  let {Account, Role, Flag, RoleMapping, Course, Enrollment} = server.models;

  Account.find({where: { username: 'admin'}}, (err, powerUser) => {
    if (err) console.error(err);
    const adminId = powerUser.id;
    // Test Course
    Course.findOrCreate({ where: {
        name: 'Testkurs',
        category: 'Kurs'}
    }, {
      abstract: null,
      authorId: adminId,
      category: 'Kurs',
      content: [
        {
          'name': 'laya-dialog',
          'input': {
            'bg': '',
            'question': {
              'flagged': true,
              'id': '99test001',
              'text':'New Stuff'
            },
            'answers':[
              {
                'flagged': false,
                'text': 'Sample Answer 1',
                'id': '99test31'
              },
              {
                'text': 'Sample Answer ',
                'id': '99test32',
                'flagged': false
              }
            ],
            'title': {
              'text': 'Dialog',
              'id': '99test41',
              'flagged': false
            }
          },
          'nextStep': '2,3',
        },
        {
          'name': 'laya-plyr',
          'input': {
            'src': {
              'flagged': false,
              'id':'99test30',
              'text': 'https://vimeo.com/27244727'
            },
            'title': {
              'text': 'Video',
              'id': '99test33',
              'flagged': false
            }
          },
          'nextStep': '4'
        },
        {
          'name': 'laya-wysiwyg',
          'input': {
            'title': {
              'text': 'WYSIWYG',
              'id': '99test34',
              'flagged': false
            },
            'contents': {
              'ops':[
                {
                  'insert': 'This Concludes our very small sample course.\n'
                }
              ]
            }
          },
          'nextStep': '4'
        },
        {
          'name': 'laya-course-feedback',
          'input': {
            'title': {
              'text': 'Course Feedback',
              'flagged': false,
              'id': '99test35'
            },
            'task': {
              'flagged': false,
              'id': '99test002',
              'text': 'This content block allows you to give feedback. Our goal is\
            to make our courses as comprehesible and accessible as possible.\
            Therefore, we kindly ask you to give your opinion about our content\
            and conveyance. The feedback is given anonymously. If you agree \
            to answer any question we might have about your feedback, please \
            click the corresponding button.',
            },
            'taskAudio': '',
            'items':[
              {
                'flagged': false,
                'id': '99test003',
                'text': 'The course has a discernible structure.',
              },
              {
                'flagged': false,
                'id': '99test004',
                'text':'The course has interesting contents',
              },
              {
                'flagged': false,
                'id': '99test005',
                'text':  'The course difficulty was adequate.',
              },
              {
                'flagged': false,
                'id': '99test006',
                'text': 'I did not feel underchallenged at any point.',
              },
              {
                'flagged': false,
                'id': '99test007',
                'text':'I did not feel overwhelmed at any point.',
              },
              {
                'flagged': false,
                'id': '99test008',
                'text':'The assessment blocks helped me understand.',
              },
              {
                'flagged': false,
                'id': '99test009',
                'text':'I would recommend this course to others.',
              },
            ],
            'categories':[
              'Do not agree',
              'Rather do not agree',
              'Neutral',
              'Rather agree',
              'Agree',
            ]

          },
          'nextStep': '0',
        }
      ],
      lastChanged: Date.now(),
      feedback: [],
      files: [],
      locked: false,
      name: 'Testkurs',
      courseId: 't3stkur5',
      storageId: 'st0r31d',
      settings: {
        enrollment: true,
        simpleLanguage: false
      },
      startDate: null,
      startInteractionId: null
    }, (err) => {
      if (err) return console.error(err);
      console.log('Sample Course exists');

    });

    // second test course
    Course.findOrCreate({where: { name: 'Testkurs - Tooltips', category: 'Descriptions' }}, {
      name: 'Testkurs - Tooltips',
      category: 'Descriptions',
      abstract: null,
      locked: false,
      courseId: 't3stkur5700l',
      lastChanged: Date.now(),
      content:[
        {
          'input': {
            'answers':
              [{
                'text':'Sample Answer',
                'id': '99test38',
                'flagged': false
              }, {
                'text':'Sample Answer',
                'id': '99test40',
                'flagged': false
              }],
            'bg': '',
            'question': {
              'flagged':false,
              'id':'t3stfl4g',
              'text':'New Stuff'
            },
            'title': {
              'flagged': true,
              'id':'0th3rfl4g',
              'text':'Our dialog'
            }
          },
          'name': 'laya-dialog',
          'nextStep' :'2,3'
        },
        {
          'input': {
            'title': {
              'flagged': false,
              'id':'99test36',
              'text':'Vimeo Video'
            },
            'src':'https://vimeo.com/27244727'
          },
          'name':'laya-plyr',
          'nextStep':'4'
        },
        {
          'input':{
            'contents': {
              'ops':[
                {
                  'insert':'This Concludes our very small sample course.\n'
                }
              ]
            },
            'title':{
              'flagged':false,
              'id':'99test37',
              'text':'WYSIWYG 2'
            }
          },
          'name':'laya-wysiwyg',
          'nextStep':'4'
        },
        {
          'input': {
            'categories':[
              'Do not agree',
              'Rather do not agree',
              'Neutral',
              'Rather agree',
              'Agree'
            ],
            'items':[
              {
                'id': '99test10',
                'flagged': false,
                'text': 'The course has a discernible structure.'
              },
              {
                'id': '99test11',
                'flagged': false,
                'text': 'The course has interesting contents'
              },
              {
                'id': '99test12',
                'flagged': false,
                'text': 'The course difficulty was adequate.'
              },
              {
                'id': '99test13',
                'flagged': false,
                'text': 'I did not feel underchallenged at any point.'
              },
              {
                'id': '99test14',
                'flagged': false,
                'text': 'I did not feel overwhelmed at any point.'
              },
              {
                'id': '99test15',
                'flagged': false,
                'text': 'The assessment blocks helped me understand.'
              },
              {
                'id': '99test16',
                'flagged': false,
                'text': 'I would recommend this course to others.'
              }
            ],
            'task': {
              'id': '99test17',
              'flagged': false,
              'text': 'This content block allows you to give feedback. Our goal is to make our courses as comprehesible and accessible as possible. Therefore, we kindly ask you to give your opinion about our content and conveyance. The feedback is given anonymously. If you agree to answer any question we might have about your feedback, please click the corresponding button.'
            },
            'taskAudio':'',
            'title':{
              'flagged':false,
              'id':'99test18',
              'text': 'Course Feedback'
            }
          },
          'name':'laya-course-feedback',
          'nextStep':'0'
        },
        {
          'input':{
            'contents':{
              'ops':[
                {'insert':'This Concludes our very small sample course.\n'}
              ]
            },
            'title': {
              'flagged':false,
              'id':'99test19',
              'text':'WYSIWYG 3'
            }
          },
          'name':'laya-wysiwyg',
          'nextStep':'4'
        },
        {
          'input': {
            'sign':'',
            'src':'',
            'sub':'',
            'title':{
              'flagged':false,
              'id':'99test20',
              'text':'AblePlayerSample'
            }
          },
          'name':'laya-ableplayer',
          'nextStep':'5'
        },
        {
          'input':
            {
              'maxTries':'1',
              'multiple':false,
              'options':[
                {
                  'id': '99test21',
                  'flagged': false,
                  'text': 'Antwort 1'
                }
              ],
              'solutions':[''],
              'task': {
                'id': '99test22',
                'flagged': false,
                'text': ''
              },
              'taskAudio':'',
              'title':{
                'flagged':false,
                'id':'99test23',
                'text':''
              }
            },
          'name':'laya-scmc',
          'nextStep':'6'
        },
        {
          'input':
            {
              'categories': [
                'Kategorie 1',
                'Kategorie 2'
              ],
              'items':[
                {
                  'category':-1,
                  'label':'Antwort 1',
                  'id':'99test24',
                  'flagged': false
                }
              ],
              'task': {
                'id': '99test25',
                'flagged': false,
                'text': ''
              },
              'taskAudio':'',
              'title':{
                'flagged':false,
                'id':'99test26',
                'text':''
              }
            },
          'name':'laya-quiz-drag-drop',
          'nextStep':'7'
        },
        {
          'input':{
            'pairs':[
              {
                'audio':'',
                'img':'',
                'label': '',
                'relation':-1,
                'id':'99test27',
                'flagged': false,
              }
            ],
            'relations':[
              'Lösung 1',
              'Lösung 2'
            ],
            'task': {
              'id': '99test28',
              'flagged': false,
              'text': ''
            },
            'taskAudio':'',
            'title':{
              'flagged':false,
              'id':'99test29',
              'text':''
            }
          },
          'name':'laya-quiz-relate',
          'nextStep':'0'
        }
      ],
      'settings': {
        'enrollment': false,
        'simpleLanguage': false
      },
      'storageId':'st0r31d700l',
      'files':[],
      'authorId':adminId,
      'startInteractionId':null
    } , (err) => {
      if (err) return console.error(err);
      console.log('Sample Course with Explanations exists');
    });

  //  mockup flag
  Flag.findOrCreate({
    where: {
      courseId: 't3stkur5700l',
      authorId: adminId
    }
  }, {
    created: Date.now(),
    referenceId: 't3stfl4g',
    question: {
      text: 'Was ist das hier für ein Spasz?',
      edited: false,
      editTime: null
    },
    courseId: 't3stkur5700l',
    authorId: adminId,
    enrollmentId: 1,
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

    // Set Role
    Role.findOrCreate({where: {name: 'test'}}, {
      name: 'test',
    }, (err, role) => {
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

    // sample enrollment for test user
    Enrollment.findOrCreate({ where: {
      studentId: test.id,
      courseId: 't3stkur5'
      }
    }, {
      studentId: test.id,
      courseId: 't3stkur5'
    }, (err, enrol) => {
      if (err) console.error(err);
      if (enrol) console.log('Test Enrollment exists');
    })
  });
}

