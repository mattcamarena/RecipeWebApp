var rid = "";
var saveRecipe;

checkLogged()

function checkLogged(){
 
    fetch('/verifySession', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    }).then (response => response.json())
    .then(data => {
      if(data.message == "valid"){
        console.log("val")
        document.getElementById("editButt").style.display = "unset";

      }else{
        console.log("notvalid")
      }
    })
}

function loadtopage(jsn) {
  saveRecipe = jsn;
  rid = jsn._id;
  var title = (jsn.name);
  document.getElementById("recipename").innerText = title;
  
  var ingr = (jsn.ingredients);
  let ingrlist = document.getElementById("ingredients");
    if(ingr.length > 0){
      ingr.forEach((item)=>{
        let li = document.createElement("li");
        li.innerText = item;
        ingrlist.appendChild(li);
      });
    }
  
  var instr = (jsn.instructions);
  let instrlist = document.getElementById("instructions");
  if(instr.length > 0){
    instr.forEach((item)=>{
      let li = document.createElement("li");
      li.innerText = item;
      instrlist.appendChild(li);
    });
  }
      
}

function triggerMe()
{
    
    if (confirm("Are you sure you want to delete")) 
    {
      hrefCall();
      return true;
    } 
    else 
    {
        return false;
    }
}

function hrefCall() {
  fetch('../api/deleterecipe/' + rid)
  .then(response => response.json())
  .then(window.location.href = "../");
}
// can make newingr/newinstr one function with attribute type as param
function newIngredient(name){
  if(typeof(name) === 'undefined') name = "";
  const newNode = document.createElement("textarea");
  newNode.setAttribute('name', "ingredient");
  newNode.innerText = name;
  const list = document.getElementById("gtxtarea");
  list.appendChild(newNode);
} 

function removeIngredient(){
  var select = document.getElementById('gtxtarea');
  if(select.children.length > 2) select.removeChild(select.lastChild);
} 

function newInstruction(name){
  if(typeof(name) === 'undefined') name = "";
  const newNode = document.createElement("textarea");
  newNode.setAttribute('name', "instruction");
  newNode.innerText = name;
  const list = document.getElementById("stxtarea");
  
  list.appendChild(newNode);
} 

function removeInstruction(){
  var select = document.getElementById('stxtarea');
  if(select.children.length > 2) select.removeChild(select.lastChild);
} 


function editRecipe(){
  fetch('/verifySession', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    })
  .then(response => response.json())
  .then(data => {
    if(data.message == "valid"){
      document.getElementById('editButt').style.display = "none";
      document.getElementById('viewdiv').style.display = "none";
      document.getElementById('editdiv').style.display = "block";
      loadRecipeonEdit();
    }else {
      window.location.href = "/login/login.html"
    }
    })
}

function loadRecipeonEdit(){
  document.getElementById("recipe-form").action += rid;
  // load name
  document.getElementById("uname").innerText = saveRecipe.name;
  // load ingredients
  var ingr = saveRecipe.ingredients;
  if(ingr.length > 0){
    ingr.forEach((item)=>{
      newIngredient(item);
    });
  }
  // load instructions
  var instr = saveRecipe.instructions;
  if(instr.length > 0){
    instr.forEach((item)=>{
      newInstruction(item);
    });
  }
}