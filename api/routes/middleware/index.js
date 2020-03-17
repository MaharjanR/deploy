'use strict';

const { models } = require('../../db');
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');

// Get references to our models.
const { User } = models;

// function to authenticate user
const authenticateUser = async ( req, res, next ) => {
    
    let message;

    //Parse the user credentials
    const credentials = auth(req);

    if(credentials){

        // check to see if there is an user with the given email address
        const user = await User.findOne({ raw: true, where: {emailAddress: credentials.name} });

        // if user found
        if(user){

            // check password and if match authenticated is true else false
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

            // if password match
            if(authenticated){
                // Store the retrieved user object on the request object so any middleware functions that follow this middleware function will have access to the user's information.
                req.currentUser = user;
            }
            else{
                message = `Authenticatio nfailure for ${user.emailAddress}`;
            }
        }
        else{
            message = `User not found  of ${credentials.emailAddress}`;
        }
    }
    else{
        message = 'Auth header was not found';
    }

    // if there is errors
    if(message){
        console.warn(message);
        res.status(401).json({message: 'Access Denied'});
    }
    else{
        // Calls the next function
        next();
    }
}

module.exports = authenticateUser;