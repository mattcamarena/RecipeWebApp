// modules needed

const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const port = 3000;

// Database
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

//Schema for recipes
const Schema = mongoose.Schema;
const recipeSchema = new Schema({
  name: { type: String, required: true},
  ingredients: [String],
  instructions: [String]
});
const Recipe = mongoose.model("Recipe", recipeSchema);

// Set pathes 
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => { res.sendFile((__dirname + '/public/view/index.html'));  });

// return ejs for recipe view 
app.get('/viewrecipe/:food',function(req,res){
  var recipeG = req.params.food;
  res.render('viewrecipe.ejs', {recipeG});
});

/**************     API REQUESTS       *************/
// Return the recipe for selected food --> should change to the id in case of multiple ingredients
app.get('/api/getrecipe/:food',function(req,res){
  //res.sendFile(path.resolve('public/recipe.html'));
  var recipeName = req.params.food;
  Recipe.find({name: `${recipeName}`}, function(err, arr){
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



//fix name spacing
app.get('/addrecipe',function(req,res){
  var recipeG = req.params.food;
  res.render('addrecipe.ejs', {recipeG});
});

// returns a .json with the list of recipe names
// use select to only return names ***** FIX ****
app.get('/recipes.json', (req, res) => {
  //Recipe.find({}, {name:1, _id:0});
  Recipe.find({}, function(err, arr) {
    
    if(err) return console.log("cerr" + err);
    else{
      //console.log(arr);
     var names = [];
    for(x in arr){
      names.push(arr[x].name);
      
    }
      res.json(names);
    }
  });  
});

// UPLOAD RECIPE
app.post('/api/addrecipe', (req,res) => {
  if(req.body.password == process.env.API_ID) {
    var recipeA = req.body.recipename;
    var ing = req.body.ingredient ? [].concat(req.body.ingredient) : [];
    var ins = req.body.instruction ? [].concat(req.body.instruction): [];
  
    var newRecipe = new Recipe({name:recipeA, ingredients:ing, instructions:ins });
    newRecipe.save(function(err, data) {
      if (err) return console.error(err);
      res.render('recipe.ejs', {recipeG: recipeA});
    });
  }else{
      res.send('wrong pass');
  }
});

/*
app.get('/api/deleterecipe/:id', (req,res) => {
  Recipe.findByIdAndRemove(req.body.id, function(err){
    if(err) return console.log(err);
  });                
  res.json("gj");
});
const removeById = (personId, done) => {
  Person.findByIdAndRemove(
    personId,
    (err,person) =>{
    if(err) return console.log(err);
    done(null,person);
  }
  );
};
*/
//404 Error
app.use(function(req, res, next) {
    res.status(404);
    res.sendFile(__dirname + '/404.html');
});

// Express server listens on port
app.listen(port, function(){
  console.log(`App server is running on port ${port}`);
});
