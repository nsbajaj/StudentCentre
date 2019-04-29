var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var credits = new Schema({
    "courseCode": String,
    "courseName": String,
    "termCompleted": String,
    "gradeEarned": String
  });
  
module.exports = credits;