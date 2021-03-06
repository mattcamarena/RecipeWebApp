// Package Requirements
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
//Express setup
const app = express();
const port = 3000;

const mySalt = 10;
const users = [];
// Database
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

// Schema for Recipes 
const Schema = mongoose.Schema;
const recipeSchema = new Schema({
  name: { type: String, required: true},
  ingredients: [String],
  instructions: [String]
});// Future thoughts: Author / date made / type(breakfast lunch dinner)
const Recipe = mongoose.model("Recipe", recipeSchema);

// Set path
app.set('view engine', 'ejs');
app.use(express.static('public'));
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
    Recipe.findOneAndUpdate({_id: rid}, {name: uName, ingredients: ing, instructions: ins}, function(err){
      if(!err){
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
    res.status(201).send()
  } catch{
    res.status(500).send()
  }
})

app.post('users/login', async (req,res)=>{
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
})
 

//
app.get('/register', (req,res) => {
  res.sendFile(__dirname + '/public/register/register.html');
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