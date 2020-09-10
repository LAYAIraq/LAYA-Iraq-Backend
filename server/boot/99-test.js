'use strict';

//import * as sampleCourse from "../../common/samplecourse.json"

module.exports = function(server) {
    let {Account, Role, Flag, RoleMapping, Course, Enrollment} = server.models;

    
    //mockup flag
    Flag.findOrCreate({where: {courseId: 'Testkurs', authorId: 2}}, {
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

    //mockup enrollment
    Enrollment.findOrCreate({where: {courseId: 'Testkurs', studentId: 2}}, {
        created: Date.now(),
        courseId: 'Testkurs',
        studentId: 2
    }, err =>{
        if(err) console.error(err)
        else console.log("Mockup Enrollment exists")
    })

  // test account
    Account.findOrCreate({where: {email: 'test@laya'}}, {
        email: 'test@laya',
        username: 'test',
        password: 'test',
    }, (err, test) => {
        if (err) {
        return console.error(err);
        }

        //
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
                if (principals.length == 0) {
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

                if (principals.length == 1) {
                return console.log('Test Role Principal exists');
                }

                if (principals.length > 1) {
                throw console.error('Multiple Test Role Principals exist!');
                }
            });
        });
    });

    Course.findOrCreate({where: { name: 'Testkurs', category: 'Kurs' }}, {
        abstract: null,
        authorId: 1, 
        category: "Kurs", 
        content: [
            {
                "name": "laya-dialog",
                "input":{
                    "bg": "",
                    "question": "New Stuff",
                    "answers":[
                        "Sample Answer",
                        "Sample Answer"]
                },
                "nextStep": "2,3"
            },
            {
                "name": "laya-plyr-vimeo",
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
                            {"insert": "This Concludes our very small sample course.\n"}
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
            }
        ], 
        createDate: Date.$now, 
        endDate: null, 
        feedback: [], 
        locked: false, 
        name: "Testkurs",
        needsEnrollment: true, 
        startDate: null, 
        startInteractionId: null
    }, (err, course) => {
        if (err) return console.error(err)
        console.log("Sample Course exists")
        
    });
};

