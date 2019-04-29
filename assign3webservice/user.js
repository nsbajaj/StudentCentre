var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var users = new Schema({
  "userName": { type: String, unique: true },
	"fullName": String,
	"password": String,
	"statusActivated": Boolean,
	"statusLocked": Boolean,
	"role": String,
	"claims": [String]
});
  
module.exports = users;


