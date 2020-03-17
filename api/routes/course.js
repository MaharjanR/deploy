'use strict';

const express = require('express');
const { models } = require('../db');
const authenticateUser = require('./middleware');

// Get references to our models.
const { Course, User } = models;
const router = express.Router();

// Helper function to catch errors
function asyncHandler(cb){

    return async (req, res, next) =>{
        try{
            await cb(req, res);
        }
        catch(err){
            if(err.name === "SequelizeValidationError") { 
                const errorMessage = err.errors.map( errorMessage => errorMessage.message);
                res.status(400).json({ message: errorMessage });
            }
            else if( err.name === "SequelizeForeignKeyConstraintError"){
                res.status(400).json({message: 'Foreign Key is required'});
            }
            else{
                res.status(500);
                next(err);
            }
        }
    }
}

// get all the courses
router.get('/', asyncHandler( async (req, res) => {

    const course = await Course.findAll({ 
        raw: true,
        include: [  
            {
                // to show the user related to the given course
                model: User,
                as: 'teacher'
            },
        ],
     });

    // filtering the required courses data
    const updatedCourse = course.map( course => {
        console.log(course);
        return {
            id: course.id,
            title: course.title,
            description: course.description,
            estimatedTime: course.estimatedTime,
            materialsNeeded: course.materialsNeeded,
            userId: course.userId,
            firstName: course['teacher.firstName'],
            lastName: course['teacher.lastName'],
            emailAddress: course['teacher.emailAddress']
        }
    });

    res.status(200).json(updatedCourse);

}));

// get a particular course
router.get('/:id', asyncHandler (async (req, res) => {

    // getting the course id from user and pulling up the course
    const courseId = req.params.id;
    const course = await Course.findByPk( courseId, { 
        raw: true,
        // to show the user related to the given course
        include: [  
            {
                model: User,
                as: 'teacher'
            },
        ], 
    });

    // course exists then generate the course
    if(course){
        // filtering the required courses data
        const updatedCourse = {
            id: course.id,
            title: course.title,
            description: course.description,
            estimatedTime: course.estimatedTime,
            materialsNeeded: course.materialsNeeded,
            firstName: course['teacher.firstName'],
            lastName: course['teacher.lastName'],
            emailAddress: course['teacher.emailAddress']
        }
        res.status(200).json(updatedCourse);
    }
    else{
        res.status(404).next();
    }
}));

//create a course
router.post('/', authenticateUser, asyncHandler (async(req, res) => {

    const course = await Course.create(req.body);
    res.location(`/courses/${course.null}`);
    res.status(201).end();

}));

// edit a course
router.put('/:id', authenticateUser, asyncHandler (async( req, res) => {

    // getting the course requested by the user
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);

    // getting the course user id and logged in user id
    const currentUserID = req.currentUser.id;
    const courseUserId = course.userId;

    // if course found, work on the course
    if(course){

        const data = req.body;
        // if logged in id and course id is same then update
        if(courseUserId === currentUserID){  
            if(data.title && data.description){
                await course.update(req.body);
                res.status(204).end();
            }
            else{
                res.status(400).json({ message: 'Title and Description needs to be updated'});
            }
        }
        else{
            res.status(403).json({ message: 'The current user doesnt own the requested course'});
        }
    }
    else{
        res.status(404).next();
    }

}));

// Delete a course
router.delete('/:id', authenticateUser, asyncHandler (async( req, res ) => {

    // getting the course requested by the user
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);

    // getting the course user id and logged in user id
    const currentUserID = req.currentUser.id;
    const courseUserId = course.userId;

    // if course found, work on the course
    if(course){
        // if logged in id and course id is same then update
        if(courseUserId === currentUserID){   
            await course.destroy(req.body);
            res.status(204).end();
        }
        else{
            res.status(403).json({ message: 'The current user doesnt own the requested course'});
        }
    }
    else{
        res.status(404).next();
    }
}));

module.exports = router;