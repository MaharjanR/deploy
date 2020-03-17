'use strict';
const Sequelize = require('sequelize');

module.exports = sequelize => {
    class User extends Sequelize.Model {}

    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoincrement: true
        },
        firstName:{
            type: Sequelize.STRING,
            allowNull: false,   
            validate: {
                notEmpty: {
                    msg: '"First Name" is required'
                },
            },   
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,  
            validate: {
                notEmpty: {
                    msg: '"Last Name" is required'
                },
            },    
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: '"Email Address" is required'
                },
                isEmail: {
                    msg: '"Email Address" is not valid'
                }, 
            }, 
            unique: {
                args: true,
                msg: 'Email address already in use!'
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,   
            validate: {
                notEmpty: {
                    msg: '"Password" is required'
                },
            },   
        }
    }, { 
        sequelize,
        modelName: 'User'
    });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'teacher',
            foreignKey: 'userId',
        });
    };

    return User;
}