var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courses = new Schema({
    "courseId": Number,
    "term": String,
    "academicProgram": String,
    "level": Number,
    "prerequisite": [String],
    "courseCode": String,
    "section": String,
    "termSectionId": Number,
    "enrolCapacity": Number,
    "enrolTotal": Number,
    "room": String,
    "roomCapacity": Number,
    "classStart": String,
    "classEnd": String,
    "classMon": String,
    "classTue": String,
    "classWed": String,
    "classThu": String,
    "classFri": String,
    "dateStart": String,
    "dateEnd": String,
    "professor": String
  });

  module.exports = courses;