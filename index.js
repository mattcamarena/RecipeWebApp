// Package Requirements
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const mySalt = 10;

//Express setup
const app = express();
const port = 3000;

const users = [];
// Database
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

// Functions 
//token creation
function generateToken(n) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for(var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

/********* Schemas ********/
// Schema for Recipes 
const Schema = mongoose.Schema;

// //Recipe
const recipeSchema = new Schema({
  name: { type: String, required: true},
  ingredients: [String],
  instructions: [String]
});// Future thoughts: Author / date made / type(breakfast lunch dinner)
const Recipe = mongoose.model("Recipe", recipeSchema);

// //User
const userSchema = new Schema({
  username: {type: String, required: true},
  hashedpass: {type: String, required: true},
  priv: {type: Number},
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

/**************     View REQUESTS       *************/
// // Home View
app.get('/', (req, res) => { res.sendFile((__dirname + '/public/view/index.html'));  });

// // Recipe View
app.get('/viewrecipe/:id',function(req,res){
  var recipeId = req.params.id;
  res.render('viewrecipe.ejs', {recipeId});
});

// // Add Recipe View  
app.get('/addrecipe',function(req,res){
  var recipeG = req.params.food;
  res.render('addrecipe.ejs', {recipeG});
});

/**************     API REQUESTS       *************/
// returns a .json with the list of recipe names + id's
app.get('/api/getrecipes', (req, res) => {
  Recipe.find({}, {name:1, _id:1},function(err, arr) {
    if(err) return console.log("cerr" + err);
    else{
      res.json(arr);
    }
  });  
});

// Return the recipe for selected food --> should change to the id in case of multiple ingredients
app.get('/api/getrecipe/:_id',function(req,res){
  var recipeId = req.params._id;
  Recipe.find({_id: recipeId}, function(err, arr){
    if(err) return console.log(err);
    else{
      if(arr.length > 0){
        res.json(arr[0]);
      }else{
        res.status(404);
        res.sendFile(__dirname + '/404.html');
      }
    }
  });
});

// Upload recipe return recipe id to have them request view
app.post('/api/addrecipe/', (req,res) => {
  if(req.body.password == process.env.API_ID) {
    var recipeA = req.body.recipename.trim();
    var ing = req.body.ingredient ? [].concat(req.body.ingredient) : [];
    var ins = req.body.instruction ? [].concat(req.body.instruction): [];
  
    var newRecipe = new Recipe({name:recipeA, ingredients:ing, instructions:ins });
    newRecipe.save(function(err, data) {
      if (err) return console.error(err);
      res.render('viewrecipe.ejs', {recipeId: newRecipe._id});
    });
  }else{
      res.send('wrong pass');
  }
});

//Delete Recipe given id *** FIX *** shouldn't be app.get
app.get('/api/deleterecipe/:_id',function(req,res){
  var rid = req.params._id;
  
  if(rid != null){
  Recipe.findByIdAndRemove(rid, function(err){
    if(err) return console.log(err);
  });  
  }
  res.json("gj");
});

app.post('/api/updaterecipe/:_id',function(req,res){
  var rid = req.params._id;
  var uName = req.body.recipename.trim();
  var ing = req.body.ingredient ? [].concat(req.body.ingredient) : [];
  var ins = req.body.instruction ? [].concat(req.body.instruction): [];
  
  if(rid != null){
    Recipe.findOneAndUpdate({_id: rid}, {name: uName, ingredients: ing, instructions: ins}, function(err,rest){
      if(!err){
        console.log(rest)
        res.render('viewrecipe.ejs', {recipeId: rid});
      }else{
        res.send('index.html');
      }
      
    });  
  }
});


/******           USER AUTH          ******/
app.get('/users', (req,res) => {
  res.json(users)
})

app.post('/api/users', async (req,res) =>{
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, mySalt)
    const user = {name: req.body.name, password: hashedPassword}
    users.push(user)
    res.status(201).send('hi')
  } catch{
    res.status(500).send('bye')
  }
})


app.post('/testB', async (req,res) => {
  var ucookie = generateToken(32);
  var uname = req.body.username;
  var pass = req.body.password;
  User.findOneAndUpdate({username: uname}, {cookie: ucookie}, function(err,rest){
      if(!err){
        res.json({token: ucookie})
        
      }else{
        res.json({message: "error"});
      }
      
    });  
})



app.post('/testA', async (req, res) => {
  
  try{
    var uname = req.body.username;
    var pass = req.body.password;
    //Check if User exists
    User.find({username: uname}, async (err,results) => { // Check Username available
      if(err){
        res.json({message:"0"})
        
      }else if(!results.length){ // No user exists
        res.json({message: "-1"})
      }else{ // validate password
        console.log(results)
        try {
          if(await bcrypt.compare(pass, results[0].hashedpass)) { 
            //CREATE TOKEN --> create logged in  & send back 
            results.cookies = generateToken(32);
            results.save((err,updatedPerson)=>{
              if(err)  console.log(err);
              done(null,updatedPerson)
            })
            res.json({message: "1", token: "to be done"})
          } else {
            res.json({message: "-2"})
          }
        } catch {
          res.json({message: "-3"})
        }
        
      }
    })
  } catch{
    res.send({message:"-4"})
  }
  
  
})

app.post('/login', async (req,res)=>{

  console.log(req.body);
  
  /*
  var uname = req.body.name;
  try{
    User.find({username: uname}, function (err,results){ // Check Username available
      if(err){
        console.log("?")
        res.send(err)
      }
      else if(!results.length){ // If no user exists make one
        console.log(uname);
        console.log("??")
        console.log(results)
        res.json({message: "user does not exist"})
       
      }else{ // send error
        console.log("???")
        console.log(results);
        res.send({message:"wow"})
      }
    })
  } catch{
    console.log("????")
    res.send({message:"no work"})
  }
  */

  console.log("attempting login")
  /*
  const user = users.find(user=> user.name === req.body.name)
  if (user == null){
    
    return res.status(400).send('cannot find user')      
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('sucess')
    } else {
      res.send('not success')
    }
  } catch {
    res.status(500).send()
  }
  */

})
 
// Register User 
app.post('/register', async (req,res) => {
  console.log("registered new user");
  try {
    const uname = req.body.name
    const hashedPassword = await bcrypt.hash(req.body.password, mySalt)
    var privi = 0;
    User.find({username: uname}, function (err,results){ // Check Username available
      if(err){
        res.send(err)
      }
      else if(!results.length){ // If no user exists make one
        var newUser = new User({username:uname, hashedpass:hashedPassword, priv:privi, cookie:""});
        newUser.save(function(err) {
          if (err) return console.error(err + "huh");
          res.send({message:'success'}) 
        });
       
      }else{ // send error
        res.send({message: "cannot use that username"})
      }
    })
  } catch{
    res.status(500).send()
  }
})

app.post('/test', async (req,res) => {
  console.log(generateToken(32))
  
  console.log("registered new user");
  res.send("ok")
})

//404 Error
app.use(function(req, res, next) { 
    res.status(404);
    res.sendFile(__dirname + '/404.html');
});

// Express server listens on port
app.listen(port, function(){
  console.log(`App server is running on port ${port}`);
});

// LOGIN

