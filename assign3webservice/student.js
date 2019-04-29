var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var credits = require('./credit.js');
var courses = require('./course.js');

var students = new Schema({
    "academicProgram": String,
    "studentId": String,
    "familyName": String,
    "givenName": String,
    "birthDate": String,
    "email": String,
    "academicLevel": Number,
    "gpa": Number,
    "credits": [credits],
    "coursesSaved": [courses],
    "coursesConfirmed": [courses]
  });

  module.exports = students;