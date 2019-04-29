// Setup
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Passport.js components
var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");

// JSON Web Token Setup
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

// Configure its options
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
// IMPORTANT - this secret should be a long, unguessable string 
// (ideally stored in a "protected storage" area on the web server)
// We suggest that you generate a random 64-character string
// using the following online tool:
// https://lastpass.com/generatepassword.php 
jwtOptions.secretOrKey = 'big-long-string-from-lastpass.com/generatepassword.php';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  //console.log('payload received', jwt_payload);

  if (jwt_payload) {
    // The following will ensure that all routes using 
    // passport.authenticate have a req.user._id value 
    // that matches the request payload's _id
    next(null, { _id: jwt_payload._id });
  } else {
    next(null, false);
  }
});

// Activate the security system
passport.use(strategy);
app.use(passport.initialize());

// Data model and persistent store
const manager = require("./manager.js");

//Assignment 2 - Students
const m = manager("mongodb://username:password@senecaweb-shard-00-00-ryf1t.mongodb.net:27017,senecaweb-shard-00-01-ryf1t.mongodb.net:27017,senecaweb-shard-00-02-ryf1t.mongodb.net:27017/bti425_assign2?ssl=true&replicaSet=SenecaWeb-shard-0&authSource=admin&retryWrites=true");

// Add support for incoming JSON entities
app.use(bodyParser.json());

// Add support for CORS
app.use(cors());

// Deliver the app's home page to browser clients
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

//Cart
app.put("/api/students/:id/cart/save", (req, res) => {
  // Call the manager method to edit an existing course.
  m.studentCartSave(req.params.id, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

app.put("/api/students/:id/cart/confirm", (req, res) => {
  // Call the manager method to edit an existing course.
  m.studentCartConfirm(req.params.id, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

app.put("/api/students/:id/cart/clear", (req, res) => {
  // Call the manager method to edit an existing course.
  m.studentCartClear(req.params.id, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Users
// Get all
app.get("/api/users", (req, res) => {
  // Calls the manager method to get all users.
  m.userGetAll()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get one
app.get("/api/users/:userId", (req, res) => {
// Call the manager method to get one specific user.
m.userGetById(req.params.userId)
  .then((data) => {
    res.json(data);
  })
  .catch(() => {
    res.status(404).json({ "message": "Resource not found" });
  })
});

// User account activate
app.post("/api/useraccounts/activate", (req, res) => {
  m.useraccountsActivate(req.body)
    .then((data) => {
      res.json({ "message": data });
    }).catch((msg) => {
      res.status(400).json({ "message": msg });
    });
});

// User account create
app.post("/api/useraccounts/create", (req, res) => {
  m.useraccountsRegister(req.body)
    .then((data) => {
      res.json({ "message": data });
    }).catch((msg) => {
      res.status(400).json({ "message": msg });
    });
});

// User account login
app.post("/api/useraccounts/login", (req, res) => {
  m.useraccountsLogin(req.body)
    .then((data) => {
      // Configure the payload with data and claims
      var payload = {
        _id: data._id,
        userName: data.userName,
        fullName: data.fullName,
        role: data.role
      };
      var token = jwt.sign(payload, jwtOptions.secretOrKey);
      // Return the result
      res.json({ "message": "Login was successful", token: token });
      
    }).catch((msg) => {
      res.status(400).json({ "message": msg });
    });
});

// Students

// Get all
app.get("/api/students", (req, res) => {
    // Calls the manager method to get all students.
    m.studentGetAll()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(500).json({ "message": error });
      })
});
  
// Get one - ID
app.get("/api/students/:studentId", (req, res) => {
  // Call the manager method to get one specific student.
  m.studentGetById(req.params.studentId)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Get one - Username/Email
app.get("/api/students/username/:username", passport.authenticate('jwt', { session: false }), (req, res) => {
  // Call the manager method to get one specific student.
  m.studentGetByUsername(req.params.username)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Add
app.post("/api/students", (req, res) => {
  // Call the manager method to add a new student.
  m.studentAdd(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Edit
app.put("/api/students/:studentId", (req, res) => {
  // Call the manager method to edit an existing student.
  m.studentEdit(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Delete
app.delete("/api/students/:studentId", (req, res) => {
  // Call the manager method to remove a student.
  m.studentDelete(req.params.studentId)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Courses

// Get all
app.get("/api/courses", (req, res) => {
  // Calls the manager method to get all courses.
  m.courseGetAll()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get one
app.get("/api/courses/:courseId", (req, res) => {
  // Call the manager method to get one specific course.
  m.courseGetById(req.params.courseId)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Get all courses in BSD program in the Winter 2019 term.
app.get("/api/courses/bsd/winter2019", (req, res) => {
  // Calls the manager method to get all courses.
  m.courseGetBSDWinter2019()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get all courses in CPA program in the Winter 2019 term.
app.get("/api/courses/cpa/winter2019", (req, res) => {
  // Calls the manager method to get all courses.
  m.courseGetCPAWinter2019()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Add
app.post("/api/courses", (req, res) => {
  // Call the manager method to add a new course.
  m.courseAdd(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Edit
app.put("/api/courses/:courseId", (req, res) => {
  // Call the manager method to edit an existing course.
  m.courseEdit(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Delete
app.delete("/api/courses/:courseId", (req, res) => {
  // Call the manager method to remove a course.
  m.studentDelete(req.params.courseId)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});



m.connect().then(() => {
    app.listen(HTTP_PORT, () => { console.log("Ready to handle requests on port " + HTTP_PORT) });
})
.catch((err) => {
    console.log("Unable to start the server:\n" + err);
    process.exit();
});