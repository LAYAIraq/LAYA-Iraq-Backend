/**
 * Filename: 99-test.js
 * Use: Create a sample course and test user
 * Creator: cmc
 * Date: August 19, 2020
 */
'use strict'

//import * as sampleCourse from "../../common/samplecourse.json"

module.exports = function(server) {
  let {Account, Role, Flag, RoleMapping, Course, Enrollment} = server.models

  // test account
  Account.findOrCreate({where: {email: 'test@laya'}}, {
      email: 'test@laya',
      username: 'test',
      password: 'test',
    }, (err, test) => {
    if (err) {
      return console.error(err)
    }

    // Set Role
    Role.findOrCreate({where: {name: 'test'}}, {
      name: 'test',
    }, (err, role) => {
      if (err) {
        return console.error(err)
      }

      role.principals.find({
        where: {principalId: test.id},
      }, (err, principals) => {
        if (err) {
          return console.error(err)
        }

        // create if needed
        if (principals.length == 0) {
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: test.id,
          }, (err, principal) => {
            if (err) {
            return console.error(err)
            }
            return console.log('Test Role Principal created:', principal)
          })
        }

        if (principals.length == 1) {
          return console.log('Test Role Principal exists')
        }
        if (principals.length > 1) {
        throw console.error('Multiple Test Role Principals exist!')
        }
      })
    })
  })

  // Test Course
  Course.findOrCreate({ where: { 
    name: 'Testkurs', 
    category: 'Kurs' 
  } }, {
    abstract: null,
    authorId: 1, 
    category: "Kurs", 
    content: [
      {
        "name": "laya-dialog",
        "input": {
          "bg": "",
          "question": "New Stuff",
          "answers":[
            "Sample Answer",
            "Sample Answer"
          ]
        },
        "nextStep": "2,3"
      },
      {
        "name": "laya-plyr",
        "input": {
          "url": "https://vimeo.com/27244727"
        },
        "nextStep": "4"
      },
      {
        "name": "laya-wysiwyg",
        "input": {
          "contents": {
            "ops":[
              { 
                "insert": "This Concludes our very small sample course.\n"
              }
            ]
          }
        },
        "nextStep": "4"
      },
      {
        "name": "laya-course-feedback",
        "input": {
          "title": "Course Feedback",
          "task": "This content block allows you to give feedback. Our goal is to make our courses as comprehesible and accessible as possible. Therefore, we kindly ask you to give your opinion about our content and conveyance. The feedback is given anonymously. If you agree to answer any question we might have about your feedback, please click the corresponding button.",
          "taskAudio": "",
          "items":[
            "The course has a discernible structure.",
            "The course has interesting contents",
            "The course difficulty was adequate.",
            "I did not feel underchallenged at any point.",
            "I did not feel overwhelmed at any point.",
            "The assessment blocks helped me understand.",
            "I would recommend this course to others."
          ],
          "categories":[
            "Do not agree",
            "Rather do not agree",
            "Neutral",
            "Rather agree",
            "Agree"
          ]
        },
        "nextStep": "0"
      }
    ], 
    lastChanged: Date.$now, 
    endDate: null, 
    feedback: [],
    files: [],
    locked: false, 
    name: "Testkurs",
    courseId: "t3stkur5",
    storageId: "st0r31d",
    needsEnrollment: true, 
    startDate: null, 
    startInteractionId: null
  }, (err, course) => {
    if (err) return console.error(err)
    console.log("Sample Course exists")
      
  })

  // second test course
  Course.findOrCreate({where: { name: 'Testkurs - Tooltips', category: 'Descriptions' }}, {
    abstract: null,
    authorId: 1, 
    category: "Descriptions", 
    content: [
      {
        "name": "laya-dialog",
        "input":{
          "bg": "",
          "question": "New Stuff",
          "answers":[
            "Sample Answer",
            "Sample Answer"
          ]
        },
        "nextStep": "2,3"
      },
      {
        "name": "laya-plyr",
        "input": {
          "url": "https://vimeo.com/27244727"
        },
        "nextStep": "4"
      },
      {
        "name": "laya-wysiwyg",
        "input": {
          "contents": {
            "ops":[
              { "insert": "This Concludes our very small sample course.\n" }
            ]
          }
        },
        "nextStep": "4"
      },
      {
        "name": "laya-course-feedback",
        "input":{
          "title": "Course Feedback",
          "task": "This content block allows you to give feedback. Our goal is to make our courses as comprehesible and accessible as possible. Therefore, we kindly ask you to give your opinion about our content and conveyance. The feedback is given anonymously. If you agree to answer any question we might have about your feedback, please click the corresponding button.",
          "taskAudio": "",
          "items":[
            "The course has a discernible structure.",
            "The course has interesting contents",
            "The course difficulty was adequate.",
            "I did not feel underchallenged at any point.",
            "I did not feel overwhelmed at any point.",
            "The assessment blocks helped me understand.",
            "I would recommend this course to others."
          ],
          "categories":[
            "Do not agree",
            "Rather do not agree",
            "Neutral",
            "Rather agree",
            "Agree"
          ]
        },
        "nextStep": "0"
      },
      {
        "name": "laya-wysiwyg",
        "input": {
          "contents": {
            "ops":[
              { "insert": "This Concludes our very small sample course.\n" }
            ]
          }
        },
        "nextStep": "4"
      },
      {
        "name": "laya-ableplayer",
        "input": {
          "sign": "",
          "src": "",
          "sub": ""
        },
        "nextStep": "5"
      },
      {
        "name": "laya-scmc",
        "input": {
          "maxTries": 1,
          "multiple": "false",
          "options": [
            "Antwort 1"
          ],
          "solutions": [
            ""
          ],
          "task": "",
          "taskAudio": "",
          "title": ""
        },
        "nextStep": "6"
      },
      {
        "name": "laya-quiz-drag-drop",
        "input": {
          "categories": [
            "Kategorie 1",
            "Kategorie 2"
          ],
          "items": [
            {
              "label": "Antwort 1",
              "category":-1
            }
          ],
          "task": "",
          "taskAudio": "",
          "title": ""
        },
        "nextStep": "7"
      },
      {
        "name": "laya-quiz-relate",
        "input": {
          "pairs": [
            {
              "img": "",
              "audio": "",
              "relation": -1
            }
          ],
          "relations": [
            "Lösung 1",
            "Lösung 2"
          ],
          "task": "",
          "taskAudio": "",
          "title": ""
        },
        "nextStep": "0"
      },
    ], 
    lastChanged: Date.$now, 
    endDate: null, 
    feedback: [],
    files: [],
    locked: false, 
    name: "Testkurs - Tooltips",
    courseId: "t3stkur5700l",
    storageId: "st0r31d700l",
    needsEnrollment: false, 
    startDate: null, 
    startInteractionId: null
  }, (err, course) => {
    if (err) return console.error(err)
    console.log("Sample Course with Explanations exists")
  })

  //  mockup flag
  // FIXME: correct primary key
  Flag.findOrCreate({ 
    where: {
      courseId: 'Testkurs', 
      authorId: 2
    }
  }, {
    created: Date.now(),
    coordinates: {x: 125, y: 125},
    question: "Was ist das hier für ein Spasz?",
    courseId: "Testkurs",
    authorId: 2,
    enrollmentId: 1
  }, err => {
    if (err) console.error(err)
    else console.log("Mockup flag exists")
  })

  //mockup enrollment removed
}

