'use strict';

const express = require('express');
const { models } = require('../db');
const bcryptjs = require('bcryptjs');
const authenticateUser = require('./middleware');

// Get references to our models.
const { User } = models;
const router = express.Router();

// Helper function to catch errors
function asyncHandler(cb){
    return async (req, res, next) =>{
        try{
            await cb(req, res);
        }
        catch(err){
            if(err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") { 
                const errorMessage = err.errors.map( errorMessage => errorMessage.message);
                res.status(400).json({message: errorMessage});
            }
            else{
                res.status(500);
                next(err);
            }
        }
    }
}

// get authenticated user   
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    
    const currentUser = req.currentUser;
    const user = {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        emailAddress: currentUser.emailAddress
    }
    res.status(200).json(user);

}));

// create a new user
router.post('/', asyncHandler(async (req, res) => {
    
    if(req.body){
        const user = await User.build(req.body);

        if(user.password){
            user.password = bcryptjs.hashSync(user.password);
        }

        await user.save();
        res.location('/');
        res.status(201).end();

    }
    else{
        res.status(404).next();
    }
}));

module.exports = router;