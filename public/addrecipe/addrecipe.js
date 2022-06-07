function newIngredient(){
  const newNode = document.createElement("textarea");
  newNode.setAttribute('name', "ingredient");
  const list = document.getElementById("gtxtarea");
  list.appendChild(newNode);
} 

function removeIngredient(){
  var select = document.getElementById('gtxtarea');
  if(select.children.length > 2) select.removeChild(select.lastChild);
} 

function newInstruction(){
  const newNode = document.createElement("textarea");
  newNode.setAttribute('name', "instruction");
  const list = document.getElementById("stxtarea");
  list.appendChild(newNode);
  
} 

function removeInstruction(){
  var select = document.getElementById('stxtarea');
  if(select.children.length > 2) select.removeChild(select.lastChild);
} 
