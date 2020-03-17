'use strict';

const express = require('express');
const users = require('./users');
const course = require('./course');

const app = express();

app.use('/users', users);
app.use('/courses', course);

module.exports = app;