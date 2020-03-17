'use strict';
const Sequelize = require('sequelize');

module.exports = sequelize => {
    class Course extends Sequelize.Model {}

    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoincrement: true
        },
        title:{
            type: Sequelize.STRING,
            allowNull: false,   
            validate: {
                notEmpty: {
                    msg: '"Title" is required'
                },
            },          
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,      
            validate: {
                notEmpty: {
                    msg: '"Description" is required'
                },
            },  
        },
        estimatedTime: {
            type: Sequelize.STRING,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
        }
    }, { 
        sequelize,
        modelName: 'Course'
    });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'teacher',
            foreignKey: 'userId',
        });
    };

    return Course;
}