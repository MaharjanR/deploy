'use strict'

const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'fsjstd-restapi.db',
    logging: false
});

const models = {};

try{
    // Importing all the models 
    fs
        .readdirSync(path.join(__dirname, 'models',))   // returns the path of db/models
        .forEach(file => {                              // looping through 2 models i.e courses and user
            console.log(`Importing database models from file: ${file}`);
            const model = sequelize.import(path.join(__dirname, 'models', file));   // returns the path of db/models/user or db/models/course
            models[model.name] = model; // adding models
        });

    // If available, call method to create associations.
    Object.keys(models).forEach((modelName) => {
        if (models[modelName].associate) {
        console.info(`Configuring the associations for the ${modelName} model...`);
        models[modelName].associate(models);
        }
    });

    console.log('Connection to the database successful');
}

catch(err){
    console.error(err);
}


module.exports = {
    sequelize,
    Sequelize,
    models,
};