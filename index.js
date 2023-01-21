// Package Requirements
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const mySalt = 10;
var sessions = require('express-session')
const cookieParser = require("cookie-parser");

const expireTime = 1000 * 60 * 60 * 24;
//Express setup
const app = express();
const port = 3000;

// Database
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

/********* Schemas ********/
// Schema for Recipes 
const Schema = mongoose.Schema;

// //Recipe
const recipeSchema = new Schema({
  name: { type: String, required: true },
  ingredients: [String],
  instructions: [String],
  author: String,
  share: Boolean,
  viewed: Number,
  used: Number,
});// Future thoughts: Author / date made / type(breakfast lunch dinner)
const Recipe = mongoose.model("Recipe", recipeSchema);

// //User
const userSchema = new Schema({
  username: { type: String, required: true },
  hashedpass: { type: String, required: true },
  priv: { type: Number },
  cookie: String
});
const User = mongoose.model("User", userSchema);

// Paths
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json({
  type: ['application/json', 'text/plain']
}))
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(sessions({
  secret: process.env.SESSION_ID,
  saveUninitialized: true,
  cookie: { maxAge: expireTime },
  resave: false
}));

var session;
/**************     View REQUESTS       *************/
// // Home View
app.get('/', (req, res) => { res.sendFile((__dirname + '/public/view/index.html')); });

// // Recipe View
app.get('/viewrecipe/:id', function(req, res) {
  var recipeId = req.params.id;
  res.render('viewrecipe.ejs', { recipeId });
});

// // Add Recipe View  
app.get('/addrecipe', function(req, res) {
  session = req.session;
  if (session.userId) {
    var recipeG = req.params.food;
    res.render('addrecipe.ejs', { recipeG });
  } else {
    res.redirect("/login/login.html")
  }
});

// // View only my recipes
app.get('/viewmyrecipes', function(req, res) {
  session = req.session;

  if (session.userId) {
    res.redirect("/viewmyrecipes/myrecipes.html")
  } else {
    res.redirect("/login/login.html")
  }
});


/**************     API REQUESTS       *************/
// returns a .json with the list of recipe names + id's
app.get('/api/getrecipes', (req, res) => {
  Recipe.find({}, { name: 1, _id: 1 }, function(err, arr) {
    if (err) return console.log("cerr" + err);
    else {
      res.json(arr);
    }
  });
});

// Return the recipe for selected food --> should change to the id in case of multiple ingredients
app.get('/api/getrecipe/:_id', function(req, res) {
  var recipeId = req.params._id;
  Recipe.find({ _id: recipeId }, function(err, arr) {
    if (err) return console.log(err);
    else {
      if (arr.length > 0) {
        res.json(arr[0]);
      } else {
        res.status(404);
        res.sendFile(__dirname + '/404.html');
      }
    }
  });
});

app.get('/viewmyrecipes/api/getmyrecipes', function(req, res) {
  session = req.session;
  
  var theauth = session.userId;
  if (session.userId) {
    Recipe.find({ author:theauth }, function(err, arr) {
      if (err) return console.log(err);
      else {
        if (arr.length > 0) {
          res.json(arr);
        } else {
          
          res.status(404);
          res.sendFile(__dirname + '/404.html');
        }
      }
    });
  } else {
   
    res.json({});
  }
});

// Upload recipe return recipe id to have them request view
app.post('/api/addrecipe/', (req, res) => {
  session = req.session
  if (session.userId) {
    var recipeA = req.body.recipename.trim();
    var ing = req.body.ingredient ? [].concat(req.body.ingredient) : [];
    var ins = req.body.instruction ? [].concat(req.body.instruction) : [];
    var aut = session.userId;
    var newRecipe = new Recipe({ name: recipeA, ingredients: ing, instructions: ins, author: aut });
    newRecipe.save(function(err, data) {
      if (err) return console.error(err);
      res.render('viewrecipe.ejs', { recipeId: newRecipe._id });
    });
  } else {
    res.redirect("/login/login.html")
  }
});

//Delete Recipe given id *** FIX *** shouldn't be app.get
app.get('/api/deleterecipe/:_id', function(req, res) {
  var rid = req.params._id;

  if (rid != null) {
    Recipe.findByIdAndRemove(rid, function(err) {
      if (err) return console.log(err);
    });
  }
});

app.post('/api/updaterecipe/:_id', function(req, res) {
  var rid = req.params._id;
  var uName = req.body.recipename.trim();
  var ing = req.body.ingredient ? [].concat(req.body.ingredient) : [];
  var ins = req.body.instruction ? [].concat(req.body.instruction) : [];

  if (rid != null) {
    Recipe.findOneAndUpdate({ _id: rid }, { name: uName, ingredients: ing, instructions: ins }, function(err, rest) {
      if (!err) {
        res.render('viewrecipe.ejs', { recipeId: rid });
      } else {
        res.send('index.html');
      }

    });
  }
});


/******           USER AUTH          ******/

app.post('/verifySession', async (req, res) => {
  session = req.session;

  if (session.userId) {
    res.json({ message: "valid", username: session.userId })
  } else {
    res.json({ message: "-1" })
  }
})


app.post('/login', async (req, res) => {
  var uname = req.body.username;
  var pass = req.body.password;
  console.log(uname)
  //cookie
  User.findOne({ username: uname }, async (err, results) => {
    if (!err) {
      try {
        if (await bcrypt.compare(pass, results.hashedpass)) {
          session = req.session;
          session.userId = uname;
          res.json({ message: "valid", uname: uname })

        } else {
          res.json({ message: "Invalid User/ Password" })
        }

      } catch {
        res.json({ message: "Error" })
      }
    } else {
      res.json({ message: "Error" })
    }
  })

})

// Register User 
app.post('/register', async (req, res) => {
  console.log("registered new user");
  try {
    if (req.body.referral != process.env.REFERRAL_CODE) {
      return res.send({ message: "Referral" })
    }
    const uname = req.body.name
    const hashedPassword = await bcrypt.hash(req.body.password, mySalt)
    var privi = 0;
    User.find({ username: uname }, function(err, results) { // Check Username available
      if (err) {
        res.send(err)
      }
      else if (!results.length) { // If no user exists make one
        var newUser = new User({ username: uname, hashedpass: hashedPassword, priv: privi, cookie: "" });
        newUser.save(function(err) {
          if (err) return console.error(err + "huh");
          res.send({ message: 'success' })
        });

      } else { // send error
        res.send({ message: "cannot use that username" })
      }
    })
  } catch {
    res.status(500).send()
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

//404 Error
app.use(function(req, res, next) {
  res.status(404);
  res.sendFile(__dirname + '/404.html');
});

// Express server listens on port
app.listen(port, function() {
  console.log(`App server is running on port ${port}`);
});
