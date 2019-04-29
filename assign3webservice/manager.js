// Data service operations

// Setup
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

// Add the following statement just below "const mongoose..."
const bcrypt = require('bcryptjs');

// Load the schemas
const studentSchema = require('./student.js');
const courseSchema = require('./course.js');
const userSchema = require('./user.js');

module.exports = function(mongoDBConnectionString) {

  let Student; // defined on connection to the new db instance
  let Course;
  let UserAccounts;

  return {

    //Connect to DB
    connect: function () {
      return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString);

        db.on('error', (error) => {
          reject(error);
        });

        db.once('open', () => {
          Student = db.model("students", studentSchema);
          Course = db.model("courses", courseSchema);
          UserAccounts = db.model("useraccounts", userSchema);
          resolve();
        });
      });
    },

    studentGetAll: function () {
      return new Promise(function (resolve, reject) {

        // Fetch all users
        Student.find()
          .sort({ familyName: 'asc', givenName: 'asc' })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      })
    },

    studentGetById: function (itemId) {
      return new Promise(function (resolve, reject) {
        
        // Find one specific user
        Student.findById(itemId, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          }
          else {
            return reject('Not found');
          }
        });
      })
    },

    studentGetByUsername: function (username) {
      return new Promise(function (resolve, reject) {
        
        // Find one specific user
        Student.findOne({ email: username }, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          }
          else {
            return reject('Not found');
          }
        });
      })
    },

    studentAdd: function (newItem) {
      return new Promise(function (resolve, reject) {

        // Creates a new user
        Student.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      })
    },

    studentEdit: function (id, courses) {
      return new Promise(function (resolve, reject){
        
        // Find one specific user and updates the user.
        Student.findByIdAndUpdate(id, {$set:{'coursesSaved':courses}}, { new: true }, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }
        });
      })
    },

    studentDelete: function (itemId) {
      return new Promise(function (resolve, reject) {

        // Find one specific user and removes the user.
        Student.findByIdAndRemove(itemId, (error) => {
          if (error) {
            // Cannot delete item
            return reject(error.message);
          }
          // Return success, but don't leak info
          return resolve();
        })
      })
    },

    courseGetAll: function () {
      return new Promise(function (resolve, reject) {
        
        // Fetch all users
        Course.find()
          .sort({ academicProgram: 'asc', level: 'asc', courseCode: 'asc', section: 'asc' })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      })
    },

    courseGetById: function (itemId) {
      return new Promise(function (resolve, reject) {
        
        // Find one specific user
        Course.findById(itemId, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          }
          else {
            return reject('Not found');
          }
        });
      })
    },

    courseGetBSDWinter2019: function () {
      return new Promise(function (resolve, reject) {
        
        // Find one specific user
        Course.find({academicProgram: 'BSD', term: '2019 Winter'}, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          }
          else {
            return reject('Not found');
          }
        });
      })
    },

    courseGetCPAWinter2019: function () {
      return new Promise(function (resolve, reject) {
        
        // Find one specific user
        Course.find({academicProgram: 'CPA', term: '2019 Winter'}, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          }
          else {
            return reject('Not found');
          }
        });
      })
    },

    courseAdd: function (newItem) {
      return new Promise(function (resolve, reject) {

        // Creates a new user
        Course.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      })
    },

    courseEdit: function (newItem) {
      return new Promise(function (resolve, reject){
      
        // Find one specific user and updates the user.
        Course.findByIdAndUpdate(newItem._id, newItem, { new: true }, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }
        });
      })
    },

    courseDelete: function (itemId) {
      return new Promise(function (resolve, reject) {

        // Find one specific user and removes the user.
        Course.findByIdAndRemove(itemId, (error) => {
          if (error) {
            // Cannot delete item
            return reject(error.message);
          }
          // Return success, but don't leak info
          return resolve();
        })
      })
    },

    //Cart - Course Confirmed
    studentCartConfirm: function (id, courses) {
      return new Promise(function (resolve, reject) {
    
        // This function receives a student identifier, 
        // and a collection of course objects to be confirmed/enrolled
    
        // This function does many things:
        // 1. Fetches the specified student object
        // 2. Looks at the students existing "coursesConfirmed", 
        //    and decreases the "enrolTotal" for each one
        // 3. For each course in the incoming collection, 
        //    increase the "enrolTotal"
        // 4. Saves the incoming collection as "coursesConfirmed", 
        //    and clears/empties the "coursesSaved"
    
        // Local variable for this function's scope
        let student;
    
        // Next, we have defined a number of functions
        // Each will do a single specific Mongoose query task
    
        // Student find function
        // =====================
        let studentFind = (id) => {
          return new Promise(function (resolve, reject) {
    
            // Find one specific document
            Student.findById(id)
              .exec((error, item) => {
                if (error) {
                  // Query error
                  return reject(error.message);
                }
                // Check for an item
                if (item) {
                  // Save it in the locally-scoped variable
                  student = item;
                  // Found, one object will be returned
                  return resolve(item);
                } else {
                  return reject('Not found');
                }
    
              }); // Student.findById
          }); // return new Promise
        }; // let studentFind
        
        // Courses clear function
        // ======================
        let coursesClear = (student) => {
          return new Promise(function (resolve, reject) {
    
            // Continue if there is a student object
            if (student) {
    
              // Continue if the student object has a coursesConfirmed property
              if (student.coursesConfirmed) {
    
                // Continue if there are courses to clear
                if (student.coursesConfirmed.length > 0) {
    
                  // From the courses collection, create new array of course identifiers
                  let courseIds = student.coursesConfirmed.map(c => c._id);
    
                  // Update many has two parameters, and each is an object
                  // The first is "conditions", which selects the documents to be updated
                  //   Here, we want to match using the just-created courseIds array 
                  // The second is the "doc", which is or has the data/properties to be updated
                  //   Here, we want to decrement the value of enrolTotal 
                  Course.updateMany(
                    { "_id": { $in: courseIds } },
                    { $inc: { "enrolTotal": -1 } }
                  )
                    .exec((error, item) => {
                      if (error) {
                        // Query error
                        return reject(error.message);
                      }
                      // Check for an item
                      if (item) {
                        // Found, one object will be returned
                        return resolve(item);
                      } else {
                        return reject('Not found');
                      }
                    }); // Course.updateMany
    
                  return resolve(student);
                }
                // Continue anyway if there are no coursesConfirmed items 
                return resolve(student);
              }
              else {
                // This block runs if there is no coursesConfirmed property
                // This is NOT an error condition, so resolve
                return resolve(student);
              }
            }
            else {
              // Uh oh, something happened, and the student object went out of scope
              return reject('student is now undefined');
              
            } // if (student) 
          }); // return new Promise
        }; // let coursesClear
    
        // Courses add function
        // ====================
        let coursesAdd = (student) => {
          return new Promise(function (resolve, reject) {
            // From the courses collection, create new array of course identifiers
            let courseIds = courses.map(c => c._id);
            
            // Please note that this version of the code does NOT
            // look at enrolTotal to ensure that it's less than 4 (our max capacity for Assignment 2)
            // We probably want this web API code to work this way (exceeding enrolTotal), 
            // and enforcing this business rule elsewhere (i.e. in the Angular app)
    
            // Update many has two parameters, and each is an object
            // The first is "conditions", which selects the documents to be updated
            //   Here, we want to match using the just-created courseIds array 
            // The second is the "doc", which is or has the data/properties to be updated
            //   Here, we want to increment the value of enrolTotal 
    
            Course.updateMany(
              { "_id": { $in: courseIds } },
              { $inc: { "enrolTotal": 1 } }
            )
              .exec((error, item) => {
                if (error) {
                  console.log('coursesAdd - query error');
                  // Query error
                  return reject(error.message);
                }
                // Check for an item
                if (item) {
                  // Found, one object will be returned
                  return resolve(item);
                } else {
                  return reject('Not found');
                }
    
              }); // Course.updateMany
          }); // return new Promise
        }; // let coursesAdd
    
        // Student update some properties function
        // =======================================
        let studentUpdate = (student) => {
          return new Promise(function (resolve, reject) {
    
            // Wrap the array values properly
            var wrappedItem = { "coursesSaved": [], "coursesConfirmed": courses };
            Student.findByIdAndUpdate(id, {$set:wrappedItem}, { new: true }, (error, item) => {
              if (error) {
                // Query error
                return reject(error.message);
              }
              // Check for an item
              if (item) {
                student = item;
                return resolve(student);
              } else {
                return reject('Not found');
              }
    
            }); // Student.findByIdAndUpdate
          }); // return new Promise
        }; // let studentUpdate
    
        // Now that the above functions have been defined, call them
        // They get called in sequence, one after the other
        // The return result of one is used as input data for the next
        studentFind(id)
          .then(coursesClear)
          .then(coursesAdd)
          .then(studentUpdate)
          .then(() => {
            //console.log('studentCartConfirm completed');
            //resolve(student);
            resolve('Cart Confirmed');
          });
    
      }); // return new Promise
    },

    //Cart - Course Saved
    studentCartSave: function (id, courses) {
      return new Promise(function (resolve, reject) {
    
        // This function receives a student identifier, 
        // and a collection of course objects to be confirmed/enrolled
    
        // This function does many things:
        // 1. Fetches the specified student object
        // 2. Looks at the students existing "coursesConfirmed", 
        //    and decreases the "enrolTotal" for each one
        // 3. For each course in the incoming collection, 
        //    increase the "enrolTotal"
        // 4. Saves the incoming collection as "coursesConfirmed", 
        //    and clears/empties the "coursesSaved"
    
        // Local variable for this function's scope
        let student;
    
        // Next, we have defined a number of functions
        // Each will do a single specific Mongoose query task
    
        // Student find function
        // =====================
        let studentFind = (id) => {
          return new Promise(function (resolve, reject) {
    
            // Find one specific document
            Student.findById(id)
              .exec((error, item) => {
                if (error) {
                  // Query error
                  return reject(error.message);
                }
                // Check for an item
                if (item) {
                  // Save it in the locally-scoped variable
                  student = item;
                  // Found, one object will be returned
                  return resolve(item);
                } else {
                  return reject('Not found');
                }
    
              }); // Student.findById
          }); // return new Promise
        }; // let studentFind
        
        // Courses clear function
        // ======================
        let coursesClear = (student) => {
          return new Promise(function (resolve, reject) {
    
            // Continue if there is a student object
            if (student) {
    
              // Continue if the student object has a coursesConfirmed property
              if (student.coursesConfirmed) {
    
                // Continue if there are courses to clear
                if (student.coursesConfirmed.length > 0) {
    
                  // From the courses collection, create new array of course identifiers
                  let courseIds = student.coursesConfirmed.map(c => c._id);
    
                  // Update many has two parameters, and each is an object
                  // The first is "conditions", which selects the documents to be updated
                  //   Here, we want to match using the just-created courseIds array 
                  // The second is the "doc", which is or has the data/properties to be updated
                  //   Here, we want to decrement the value of enrolTotal 
                  Course.updateMany(
                    { "_id": { $in: courseIds } },
                    { $inc: { "enrolTotal": -1 } }
                  )
                    .exec((error, item) => {
                      if (error) {
                        // Query error
                        return reject(error.message);
                      }
                      // Check for an item
                      if (item) {
                        // Found, one object will be returned
                        return resolve(item);
                      } else {
                        return reject('Not found');
                      }
                    }); // Course.updateMany
    
                  return resolve(student);
                }
                // Continue anyway if there are no coursesConfirmed items 
                return resolve(student);
              }
              else {
                // This block runs if there is no coursesConfirmed property
                // This is NOT an error condition, so resolve
                return resolve(student);
              }
            }
            else {
              // Uh oh, something happened, and the student object went out of scope
              return reject('student is now undefined');
              
            } // if (student) 
          }); // return new Promise
        }; // let coursesClear
    
        // Courses add function
        // ====================
        let coursesAdd = (student) => {
          return new Promise(function (resolve, reject) {
            // From the courses collection, create new array of course identifiers
            let courseIds = courses.map(c => c._id);
            
            // Please note that this version of the code does NOT
            // look at enrolTotal to ensure that it's less than 4 (our max capacity for Assignment 2)
            // We probably want this web API code to work this way (exceeding enrolTotal), 
            // and enforcing this business rule elsewhere (i.e. in the Angular app)
    
            // Update many has two parameters, and each is an object
            // The first is "conditions", which selects the documents to be updated
            //   Here, we want to match using the just-created courseIds array 
            // The second is the "doc", which is or has the data/properties to be updated
            //   Here, we want to increment the value of enrolTotal 
    
            Course.updateMany(
              { "_id": { $in: courseIds } },
              { $inc: { "enrolTotal": 1 } }
            )
              .exec((error, item) => {
                if (error) {
                  console.log('coursesAdd - query error');
                  // Query error
                  return reject(error.message);
                }
                // Check for an item
                if (item) {
                  // Found, one object will be returned
                  return resolve(item);
                } else {
                  return reject('Not found');
                }
    
              }); // Course.updateMany
          }); // return new Promise
        }; // let coursesAdd
    
        // Student update some properties function
        // =======================================
        let studentUpdate = (student) => {
          return new Promise(function (resolve, reject) {
    
            // Wrap the array values properly
            var wrappedItem = { "coursesSaved": courses, "coursesConfirmed": [] };
            Student.findByIdAndUpdate(id, {$set:{'coursesSaved':courses}}, { new: true }, (error, item) => {
              if (error) {
                // Query error
                return reject(error.message);
              }
              // Check for an item
              if (item) {
                student = item;
                return resolve(student);
              } else {
                return reject('Not found');
              }
    
            }); // Student.findByIdAndUpdate
          }); // return new Promise
        }; // let studentUpdate
    
        // Now that the above functions have been defined, call them
        // They get called in sequence, one after the other
        // The return result of one is used as input data for the next
        studentFind(id)
          .then(coursesClear)
          .then(studentUpdate)
          .then(() => {
            //resolve(student);
            resolve('Cart Saved');
          });
    
      }); // return new Promise
    },

    //Cart - Course Clear
    studentCartClear: function (id, courses) {
      return new Promise(function (resolve, reject) {
    
        // This function receives a student identifier, 
        // and a collection of course objects to be confirmed/enrolled
    
        // This function does many things:
        // 1. Fetches the specified student object
        // 2. Looks at the students existing "coursesConfirmed", 
        //    and decreases the "enrolTotal" for each one
        // 3. For each course in the incoming collection, 
        //    increase the "enrolTotal"
        // 4. Saves the incoming collection as "coursesConfirmed", 
        //    and clears/empties the "coursesSaved"
    
        // Local variable for this function's scope
        let student;
    
        // Next, we have defined a number of functions
        // Each will do a single specific Mongoose query task
    
        // Student find function
        // =====================
        let studentFind = (id) => {
          return new Promise(function (resolve, reject) {
    
            // Find one specific document
            Student.findById(id)
              .exec((error, item) => {
                if (error) {
                  // Query error
                  return reject(error.message);
                }
                // Check for an item
                if (item) {
                  // Save it in the locally-scoped variable
                  student = item;
                  // Found, one object will be returned
                  return resolve(item);
                } else {
                  return reject('Not found');
                }
    
              }); // Student.findById
          }); // return new Promise
        }; // let studentFind
        
        // Courses clear function
        // ======================
        let coursesClear = (student) => {
          return new Promise(function (resolve, reject) {
    
            // Continue if there is a student object
            if (student) {
    
              // Continue if the student object has a coursesConfirmed property
              if (student.coursesConfirmed) {
    
                // Continue if there are courses to clear
                if (student.coursesConfirmed.length > 0) {
    
                  // From the courses collection, create new array of course identifiers
                  let courseIds = student.coursesConfirmed.map(c => c._id);
    
                  // Update many has two parameters, and each is an object
                  // The first is "conditions", which selects the documents to be updated
                  //   Here, we want to match using the just-created courseIds array 
                  // The second is the "doc", which is or has the data/properties to be updated
                  //   Here, we want to decrement the value of enrolTotal 
                  Course.updateMany(
                    { "_id": { $in: courseIds } },
                    { $inc: { "enrolTotal": -1 } }
                  )
                    .exec((error, item) => {
                      if (error) {
                        // Query error
                        return reject(error.message);
                      }
                      // Check for an item
                      if (item) {
                        // Found, one object will be returned
                        return resolve(item);
                      } else {
                        return reject('Not found');
                      }
                    }); // Course.updateMany
    
                  return resolve(student);
                }
                // Continue anyway if there are no coursesConfirmed items 
                return resolve(student);
              }
              else {
                // This block runs if there is no coursesConfirmed property
                // This is NOT an error condition, so resolve
                return resolve(student);
              }
            }
            else {
              // Uh oh, something happened, and the student object went out of scope
              return reject('student is now undefined');
              
            } // if (student) 
          }); // return new Promise
        }; // let coursesClear
    
        // Courses add function
        // ====================
        let coursesAdd = (student) => {
          return new Promise(function (resolve, reject) {
            // From the courses collection, create new array of course identifiers
            let courseIds = courses.map(c => c._id);
            
            // Please note that this version of the code does NOT
            // look at enrolTotal to ensure that it's less than 4 (our max capacity for Assignment 2)
            // We probably want this web API code to work this way (exceeding enrolTotal), 
            // and enforcing this business rule elsewhere (i.e. in the Angular app)
    
            // Update many has two parameters, and each is an object
            // The first is "conditions", which selects the documents to be updated
            //   Here, we want to match using the just-created courseIds array 
            // The second is the "doc", which is or has the data/properties to be updated
            //   Here, we want to increment the value of enrolTotal 
    
            Course.updateMany(
              { "_id": { $in: courseIds } },
              { $inc: { "enrolTotal": 1 } }
            )
              .exec((error, item) => {
                if (error) {
                  console.log('coursesAdd - query error');
                  // Query error
                  return reject(error.message);
                }
                // Check for an item
                if (item) {
                  // Found, one object will be returned
                  return resolve(item);
                } else {
                  return reject('Not found');
                }
    
              }); // Course.updateMany
          }); // return new Promise
        }; // let coursesAdd
    
        // Student update some properties function
        // =======================================
        let studentUpdate = (student) => {
          return new Promise(function (resolve, reject) {
    
            // Wrap the array values properly
            var wrappedItem = { "coursesSaved": [], "coursesConfirmed": [] };
            Student.findByIdAndUpdate(id, {$set:{'coursesSaved':courses}}, { new: true }, (error, item) => {
              if (error) {
                // Query error
                return reject(error.message);
              }
              // Check for an item
              if (item) {
                student = item;
                return resolve(student);
              } else {
                return reject('Not found');
              }
    
            }); // Student.findByIdAndUpdate
          }); // return new Promise
        }; // let studentUpdate
    
        // Now that the above functions have been defined, call them
        // They get called in sequence, one after the other
        // The return result of one is used as input data for the next
        studentFind(id)
          .then(coursesClear)
          .then(studentUpdate)
          .then(() => {
            //console.log('studentCartConfirm completed');
            //resolve(student);
            resolve("Cart Cleared");
          });
    
      }); // return new Promise
    },
    userGetAll: function () {
      return new Promise(function (resolve, reject) {

        // Fetch all users
        UserAccounts.find()
          .sort({ userName: 'asc' })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      })
    },

    userGetById: function (itemId) {
      return new Promise(function (resolve, reject) {
        
        // Find one specific user
        UserAccounts.findById(itemId, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          }
          else {
            return reject('Not found');
          }
        });
      })
    },
    
    // Format
    // { 
    //   userName: string, 
    //   password: string, 
    //   passwordConfirm: string, 
    //   role: string 
    // }
    useraccountsActivate: function (userData) {
      return new Promise(function (resolve, reject) {
    
        // Incoming data package has user name (email address),
        // two identical passwords, and a role (string)
        // { userName: xxx, password: yyy, passwordConfirm: yyy, role: zzz }
    
        if (userData.password != userData.passwordConfirm) {
          return reject("Passwords do not match");
        }
    
        // Generate a "salt" value
        var salt = bcrypt.genSaltSync(10);
        // Hash the result
        var hash = bcrypt.hashSync(userData.password, salt);
    
        // Attempt to update the user account
        UserAccounts.findOneAndUpdate(
          { userName: userData.userName },
          { password: hash, statusActivated: true, role: userData.role },
          { new: true }, (error, item) => {
            if (error) {
              // Cannot edit item
              return reject(`User account activation - ${error.message}`);
            }
            // Check for an item
            if (item) {
              // Edited object will be returned
              //return resolve(item);
              // Alternatively...
              return resolve('User account was activated');
            } else {
              return reject('User account activation - not found');
            }
    
          }); // UserAccounts.findOneAndUpdate
      }); // return new Promise
    }, // useraccountsActivate
    
    // Format
    // { 
    //   userName: string, 
    //   fullName: string, 
    //   password: string, 
    //   passwordConfirm: string, 
    //   role: string 
    // }
    useraccountsRegister: function (userData) {
      return new Promise(function (resolve, reject) {
    
        // Incoming data package has user name (email address), full name, 
        // two identical passwords, and a role (string)
        // { userName: xxx, fullName: aaa, password: yyy, passwordConfirm: yyy, role: zzz }
    
        if (userData.password != userData.passwordConfirm) {
          return reject("Passwords do not match");
        }
    
        // Generate a "salt" value
        var salt = bcrypt.genSaltSync(10);
        // Hash the result
        var hash = bcrypt.hashSync(userData.password, salt);
    
        // Update the incoming data
        userData.password = hash;
    
        // Create a new user account document
        let newUser = new UserAccounts(userData);
    
        // Attempt to save
        newUser.save((error) => {
          if (error) {
            if (error.code == 11000) {
              reject("User account creation - cannot create; user already exists");
            } else {
              reject(`User account creation - ${error.message}`);
            }
          } else {
            resolve("User account was created");
          }
        }); //newUser.save
      }); // return new Promise
    }, // useraccountsRegister
    
    // Format
    // { 
    //   userName: string, 
    //   password: string 
    // }
    useraccountsLogin: function (userData) {
      return new Promise(function (resolve, reject) {
    
        // Incoming data package has user name (email address) and password
        // { userName: xxx, password: yyy }
        UserAccounts.findOne(
          { userName: userData.userName }, (error, item) => {
            if (error) {
              // Query error
              return reject(`Login - ${error.message}`);
            }
            // Check for an item
            if (item) {
              // Compare password with stored value
              let isPasswordMatch = bcrypt.compareSync(userData.password, item.password);
              if (isPasswordMatch) {
                return resolve(item);
              }
              else {
                return reject('Login was not successful');
              }
            } else {
              return reject('Login - not found');
            }
    
          }); // UserAccounts.findOneAndUpdate
      }); // return new Promise
    } // useraccountsLogin
  }
}