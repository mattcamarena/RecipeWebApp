
var rid = "";
function loadtopage(jsn) {
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