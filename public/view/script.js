fetch("./api/getrecipes")
.then(response => {
  return response.json();
})
.then(jsondata => loadtopage(jsondata))

checkLogged()

function loadtopage(jsn) {

  let list = document.getElementById("myList");
  
  if(jsn.length > 0){
    jsn.forEach((item)=>{
      let li = document.createElement("li");
      let a = document.createElement('a');
      a.innerText = item.name;
      a.href = "viewrecipe/" + item._id;
      //li.innerText = item;
      li.appendChild(a);
      list.appendChild(li);
      document.getElementById("tlholder").innerText = "";
  });
  }else{
    document.getElementById("tlholder").innerText = "No recipes found";
  }
}


function logOut(){
  // make a call user wants to log out
  document.cookie = `uname=; expires=-99`
  document.cookie = `token=; expires=-99`
  
  document.getElementById("edit").children[0].style.display = "unset";
  document.getElementById("edit").children[1].style.display = "unset";
  document.getElementById("edit").children[2].style.display = "none";
  document.getElementById("edit").children[3].style.display = "none";  
}


function checkLogged(){
 
    fetch('/verifySession', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    }).then (response => response.json())
    .then(data => {
      if(data.message == "valid"){
        console.log("val")
        document.getElementById("edit").children[0].style.display = "none";
        document.getElementById("edit").children[1].style.display = "none";
        document.getElementById("edit").children[2].style.display = "unset";
        document.getElementById("edit").children[3].style.display = "unset";  
        document.getElementById("uname").innerHTML = data.username;
      }else{
        console.log("notvalid")
        document.getElementById("edit").children[0].style.display = "unset";
        document.getElementById("edit").children[1].style.display = "unset";
        document.getElementById("edit").children[2].style.display = "none";
        document.getElementById("edit").children[3].style.display = "none";  
      }
    })
}